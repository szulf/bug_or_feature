package main

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/gofiber/storage/mongodb"
	"github.com/google/uuid"
	"go.mongodb.org/mongo-driver/bson"
)

// TODO: log err's in log.Println everywhere, to get more specific error messages
// TODO: rewrite tests to use golangs native tests

type PostType string

const (
	PostBug     PostType = "BUG"
	PostFeature PostType = "FEATURE"
)

type UpvoteValue string

const (
	UpvoteUP   UpvoteValue = "UP"
	UpvoteDOWN UpvoteValue = "DOWN"
)

type Post struct {
	OwnerIP          string    `json:"owner_ip" bson:"owner_ip"`
	Id               string    `json:"id" bson:"id"`
	Message          string    `json:"message" bson:"message"`
	ImagePath        string    `json:"image_path" bson:"image_path"`
	CreationDate     time.Time `json:"creation_date" bson:"creation_date"`
	OwnersPostChoice PostType  `json:"owners_post_choice" bson:"owners_post_choice"`
	// NOTE: map from users ips to their upvote value
	UpvoteValues map[string]UpvoteValue `json:"upvote_count" bson:"upvote_count"`
	// NOTE: map from users ip to their vote type
	VoteValues map[string]PostType `json:"vote_values" bson:"vote_values"`
}

type App struct {
	store *mongodb.Storage
}

func (a *App) storePost(post Post) error {
	j, err := json.Marshal(post)
	if err != nil {
		return err
	}
	err = a.store.Set(post.Id, []byte(j), 0)
	if err != nil {
		return err
	}
	return nil
}

func (a *App) getPostById(id string) (Post, error) {
	value, err := a.store.Get(id)
	if err != nil {
		return Post{}, err
	}
	post := Post{}
	err = json.Unmarshal(value, &post)
	if err != nil {
		return Post{}, err
	}
	return post, nil
}

func (a *App) getPosts() ([]Post, error) {
	type DBEntry struct {
		Key   string `bson:"key"`
		Value []byte `bson:"value"`
	}

	cur, err := a.store.Conn().Collection("bugs").Find(context.TODO(), bson.D{})
	if err != nil {
		log.Println("error doing something idk")
		return nil, err
	}
	defer cur.Close(context.TODO())

	posts := []Post{}
	for cur.Next(context.TODO()) {
		entry := DBEntry{}
		err := cur.Decode(&entry)
		if err != nil {
			log.Println("Failed to decode DBEntry.")
			return nil, err
		}

		p := Post{}
		if err := json.Unmarshal(entry.Value, &p); err != nil {
			log.Println("Failed to decode post json.")
			return nil, err
		}

		posts = append(posts, p)
	}

	return posts, nil
}

func (a *App) updatePost(id string, newPost Post) error {
	newPost.Id = id
	j, err := json.Marshal(newPost)
	if err != nil {
		log.Println("Failed to marshal updated post.")
		return err
	}
	err = a.store.Set(id, []byte(j), 0)
	if err != nil {
		log.Println("Failed to store updated post.")
		return err
	}
	return nil
}

// TODO: do any of the errors leave some bad state behind?
func (a *App) AddPost(c fiber.Ctx) error {
	message := c.FormValue("message")
	ownersPostChoice := c.FormValue("owners_post_choice")
	if message == "" || (ownersPostChoice != "BUG" && ownersPostChoice != "FEATURE") {
		log.Println("Invalid arguments in AddPost.")
		return fiber.ErrBadRequest
	}

	imgPath := ""
	image, err := c.FormFile("image")
	if err == nil {
		file, err := image.Open()
		if err != nil {
			log.Println("Failed to open form image file.")
			return fiber.ErrBadRequest
		}
		imageData := make([]byte, image.Size)
		_, err = file.Read(imageData)
		if err != nil {
			log.Println("Failed to read form image file.")
			return fiber.ErrBadRequest
		}
		filename := make([]byte, 16)
		rand.Read(filename)
		imgPath = filepath.Join("images", hex.EncodeToString(filename))
		err = os.WriteFile(imgPath, imageData, 0666)
		if err != nil {
			log.Println("Failed to write image file on server.")
			return fiber.ErrInternalServerError
		}
	}

	post := Post{
		OwnerIP:          c.IP(),
		Id:               uuid.NewString(),
		Message:          message,
		ImagePath:        imgPath,
		CreationDate:     time.Now(),
		OwnersPostChoice: PostType(ownersPostChoice),
		VoteValues:       map[string]PostType{},
		UpvoteValues:     map[string]UpvoteValue{},
	}
	err = a.storePost(post)
	if err != nil {
		fmt.Println("Failed to store post in database.")
		return fiber.ErrInternalServerError
	}
	return c.SendString(post.Id)
}

// TODO: probably need to handle some pagination and not just return all of them
func (a *App) GetPosts(c fiber.Ctx) error {
	posts, err := a.getPosts()
	if err != nil {
		log.Println("Failed to get all posts.")
		return fiber.ErrInternalServerError
	}
	return c.JSON(posts)
}

type UpvoteData struct {
	Id    string      `json:"id"`
	Value UpvoteValue `json:"value"`
}

func (a *App) Upvote(c fiber.Ctx) error {
	data := UpvoteData{}
	err := json.Unmarshal(c.Body(), &data)
	if err != nil || (data.Value != UpvoteUP && data.Value != UpvoteDOWN) {
		log.Println("Failed to parse json body")
		return err
	}
	post, err := a.getPostById(data.Id)
	if err != nil {
		log.Println("Failed to get post.")
		return err
	}
	post.UpvoteValues[c.IP()] = data.Value
	err = a.updatePost(data.Id, post)
	if err != nil {
		log.Println("Failed to update post in db.")
		return err
	}
	return nil
}

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Llongfile)

	store := mongodb.New(mongodb.Config{
		ConnectionURI: "mongodb://root:example@localhost:27017/",
		Database:      "bug",
		Collection:    "bugs",
		Reset:         false,
	})
	defer store.Close()

	app := App{
		store: store,
	}

	f := fiber.New()
	f.Use(cors.New())

	f.Post("/add-post", app.AddPost)
	f.Get("/all-posts", app.GetPosts)
	f.Post("/upvote", app.Upvote)

	f.Listen(":3000")
}

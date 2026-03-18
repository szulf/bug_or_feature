package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/middleware/cors"
	"github.com/google/uuid"
)

// TODO: log err's in log.Println everywhere, to get more specific error messages
// TODO: rewrite tests to use golangs native tests

type PostType string

const (
	PostNONE    PostType = "NONE"
	PostBUG     PostType = "BUG"
	PostFEATURE PostType = "FEATURE"
)

type UpvoteValue string

const (
	UpvoteNONE UpvoteValue = "NONE"
	UpvoteUP   UpvoteValue = "UP"
	UpvoteDOWN UpvoteValue = "DOWN"
)

type Post struct {
	Id               string    `json:"id" bson:"_id"`
	OwnerIP          string    `json:"owner_ip" bson:"owner_ip"`
	Message          string    `json:"message" bson:"message"`
	ImagePath        string    `json:"image_path" bson:"image_path"`
	CreationDate     time.Time `json:"creation_date" bson:"creation_date"`
	OwnersPostChoice PostType  `json:"owners_post_choice" bson:"owners_post_choice"`
	// NOTE: map from users ips to their upvote value
	UpvoteValues map[string]UpvoteValue `json:"upvote_count" bson:"upvote_count"`
	// NOTE: map from users ip to their vote type
	VoteValues map[string]PostType `json:"vote_values" bson:"vote_values"`
}

func AddPostNEW(c fiber.Ctx) error {
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
	err = StorePost(post)
	if err != nil {
		log.Println("Failed to store post in database.", err)
		return fiber.ErrInternalServerError
	}
	return c.SendString(post.Id)
}

func GetPosts(c fiber.Ctx) error {
	posts, err := GetAllPosts()
	if err != nil {
		log.Println("Failed to get all posts.", err)
		return fiber.ErrInternalServerError
	}
	return c.JSON(posts)
}

type UpvoteData struct {
	Id    string      `json:"id"`
	Value UpvoteValue `json:"value"`
}

func Upvote(c fiber.Ctx) error {
	data := UpvoteData{}
	err := json.Unmarshal(c.Body(), &data)
	if err != nil || (data.Value != UpvoteNONE && data.Value != UpvoteUP && data.Value != UpvoteDOWN) {
		log.Println("Failed to parse json body")
		return err
	}
	post, err := GetPostById(data.Id)
	if err != nil {
		log.Println("Failed to get post.")
		return err
	}
	if data.Value == UpvoteNONE {
		delete(post.UpvoteValues, c.IP())
	} else {
		post.UpvoteValues[c.IP()] = data.Value
	}
	err = UpdatePost(data.Id, post)
	if err != nil {
		log.Println("Failed to update post in db.")
		return err
	}
	return nil
}

type VoteData struct {
	Id    string   `json:"id"`
	Value PostType `json:"value"`
}

func Vote(c fiber.Ctx) error {
	data := VoteData{}
	err := json.Unmarshal(c.Body(), &data)
	if err != nil || (data.Value != PostNONE && data.Value != PostBUG && data.Value != PostFEATURE) {
		log.Println("Failed to parse json body")
		return err
	}
	post, err := GetPostById(data.Id)
	if err != nil {
		log.Println("Failed to get post")
		return err
	}
	if data.Value == PostNONE {
		delete(post.VoteValues, c.IP())
	} else {
		post.VoteValues[c.IP()] = data.Value
	}
	err = UpdatePost(data.Id, post)
	if err != nil {
		log.Println("Failed to update post in db")
		return err
	}
	return nil
}

func main() {
	log.SetFlags(log.Ldate | log.Ltime | log.Llongfile)

	err := CreateConn("mongodb://root:example@mongo:27017/", "bug", "bugs")
	if err != nil {
		panic(err)
	}
	defer CloseConn()

	f := fiber.New()
	f.Use(cors.New(cors.Config{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"*"},
		AllowMethods: []string{"*"},
	}))

	f.Post("/add-post", AddPostNEW)
	f.Get("/get-posts", GetPosts)
	f.Post("/upvote", Upvote)
	f.Post("/vote", Vote)

	f.Listen(":3000")
}

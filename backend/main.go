package main

import (
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/storage/mongodb"
	"github.com/google/uuid"
)

type PostType string

const (
	PostBug     PostType = "BUG"
	PostFeature PostType = "FEATURE"
)

type Post struct {
	Id               string           `json:"id"`
	Message          string           `json:"message"`
	ImagePath        string           `json:"image_path"`
	CreationDate     time.Time        `json:"creation_date"`
	OwnersPostChoice PostType         `json:"owners_post_choice"`
	VoteCounts       map[PostType]int `json:"vote_counts"`
	UpvoteCount      int              `json:"upvote_count"`
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

func extensionFromMIME(mime string) string {
	if mime == "image/jpeg" {
		return "jpg"
	}
	return ""
}

func (a *App) AddPost(c fiber.Ctx) error {
	message := c.FormValue("message")
	ownersPostChoice := c.FormValue("owners_post_choice")
	if message == "" || (ownersPostChoice != "BUG" && ownersPostChoice != "FEATURE") {
		log.Println("invalid arguments in AddPost ")
		return nil
	}

	image, err := c.FormFile("image")
	if err != nil {
		log.Println("failed to get form image file")
		return nil
	}
	file, err := image.Open()
	if err != nil {
		log.Println("failed to open form image file")
		return nil
	}
	imageData := make([]byte, image.Size)
	_, err = file.Read(imageData)
	if err != nil {
		log.Println("failed to read form image file")
		return nil
	}
	filename := make([]byte, 16)
	contentType := image.Header.Get("Content-Type")
	rand.Read(filename)
	imgPath := filepath.Join("images", hex.EncodeToString(filename)+"."+extensionFromMIME(contentType))
	err = os.WriteFile(imgPath, imageData, 0666)
	if err != nil {
		log.Println("failed to write image file")
		return nil
	}

	post := Post{
		Id:               uuid.NewString(),
		Message:          message,
		ImagePath:        imgPath,
		CreationDate:     time.Now(),
		OwnersPostChoice: PostType(ownersPostChoice),
		VoteCounts:       map[PostType]int{PostBug: 0, PostFeature: 0},
		UpvoteCount:      0,
	}
	err = a.storePost(post)
	if err != nil {
		fmt.Println("failed to store post in db")
		// TODO: http error code
		return nil
	}
	return c.SendString(post.Id)
}

func main() {
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

	f.Post("/add-post", app.AddPost)

	f.Listen(":3000")
}

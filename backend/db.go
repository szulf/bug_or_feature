package main

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var db *mongo.Database

func CreateConn(uri, dbName string) error {
	var err error
	client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Println("Failed to create db connection.")
		return err
	}
	db = client.Database(dbName)
	return nil
}

func CloseConn() {
	err := client.Disconnect(context.TODO())
	if err != nil {
		panic(err)
	}
}

func StorePost(p Post) error {
	_, err := db.Collection("bugs").InsertOne(context.TODO(), p)
	if err != nil {
		log.Println("Failed to store post in db")
		return err
	}
	return nil
}

func GetAllPosts() ([]Post, error) {
	cur, err := db.Collection("bugs").Find(context.TODO(), bson.M{})
	if err != nil {
		return nil, err
	}
	posts := []Post{}
	for cur.Next(context.TODO()) {
		p := Post{}
		err := cur.Decode(&p)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

func GetPostById(id string) (Post, error) {
	filter := bson.M{
		"_id": id,
	}
	cur, err := db.Collection("bugs").Find(context.TODO(), filter)
	if err != nil {
		return Post{}, nil
	}
	p := Post{}
	cur.Next(context.TODO())
	err = cur.Decode(&p)
	if err != nil {
		return Post{}, nil
	}
	return p, nil
}

func UpdatePost(id string, newPost Post) error {
	filter := bson.M{"_id": id}
	_, err := db.Collection("bugs").ReplaceOne(context.TODO(), filter, newPost)
	if err != nil {
		log.Println("Failed to update post in db")
		return err
	}
	return nil
}

func GetPostsFromLastTime(time time.Time) ([]Post, error) {
	filter := bson.M{
		"creation_date": bson.M{
			"$gte": time,
		},
	}
	cur, err := db.Collection("bugs").Find(context.TODO(), filter)
	if err != nil {
		return []Post{}, err
	}
	posts := []Post{}
	for cur.Next(context.TODO()) {
		p := Post{}
		err := cur.Decode(&p)
		if err != nil {
			return []Post{}, err
		}
		posts = append(posts, p)
	}
	return posts, nil
}

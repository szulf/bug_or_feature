package main

import (
	"context"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var client *mongo.Client
var db *mongo.Database
var coll *mongo.Collection

func CreateConn(uri, dbName, collectionName string) error {
	var err error
	client, err = mongo.Connect(context.TODO(), options.Client().ApplyURI(uri))
	if err != nil {
		log.Println("Failed to create db connection.")
		return err
	}
	db = client.Database(dbName)
	coll = db.Collection(collectionName)
	return nil
}

func CloseConn() {
	err := client.Disconnect(context.TODO())
	if err != nil {
		panic(err)
	}
}

func StorePost(p Post) error {
	_, err := coll.InsertOne(context.TODO(), p)
	if err != nil {
		log.Println("Failed to store post in db")
		return err
	}
	return nil
}

func GetAllPosts() ([]Post, error) {
	cur, err := coll.Find(context.TODO(), bson.M{})
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
	cur, err := coll.Find(context.TODO(), filter)
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
	_, err := coll.ReplaceOne(context.TODO(), filter, newPost)
	if err != nil {
		log.Println("Failed to update post in db")
		return err
	}
	return nil
}

package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

type UploadResult struct {
	Status bool
	Url    string
}

func uploadImage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("Image upload endpoint hit")

	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Max filesize 10 MB
	r.ParseMultipartForm(1 << 20)

	imageId := r.FormValue("imageid")
	file, handler, err := r.FormFile("imagedata")
	if err != nil {
		fmt.Println("Error retrieving image file")
		fmt.Println(err)
		return
	}
	defer file.Close()
	fmt.Printf("Uploaded file: %+v\n", handler.Filename)
	fmt.Printf("File size: %+v\n", handler.Size)
	fmt.Printf("MIME header: %+v\n", handler.Header)
	fmt.Printf("Image id: %+v\n", imageId)

	result := UploadResult{Status: false, Url: ""}
	if handler.Filename != "4400100.jpg" {
		tempFile, err := ioutil.TempFile("temp-images", "upload-*.png")
		if err != nil {
			fmt.Println(err)
		}
		defer tempFile.Close()

		fileBytes, err := ioutil.ReadAll(file)
		if err != nil {
			fmt.Println(err)
		}
		tempFile.Write(fileBytes)
		fmt.Printf("Filename: %+v\n", tempFile.Name())
		//fmt.Fprintf(w, "Successfully uploaded file\n")
		result = UploadResult{Status: true, Url: "http://localhost:5500/backend/temp-images/" + filepath.Base(tempFile.Name())}
	}

	json.NewEncoder(w).Encode(result)
}

func main() {
	fmt.Println("Simple API backend")

	err := os.RemoveAll("temp-images/")
	if err != nil {
		fmt.Println(err)
	}
	os.Mkdir("temp-images", 0777)

	http.HandleFunc("/upload", uploadImage)
	log.Fatal(http.ListenAndServe(":8080", nil))
}

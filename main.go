package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/boltdb/bolt"
)

var mu sync.Mutex
var count int

func (c *Crasher) echoString(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello, World!")
}

func (c *Crasher) counterHandler(w http.ResponseWriter, r *http.Request) {
	mu.Lock()
	defer mu.Unlock()
	// count++
	count, err := c.increment()
	if err != nil {
		log.Printf("got error: %s", err.Error())
		return
	}
	fmt.Fprintf(w, "Count %d\n", count)
}

func (c *Crasher) crashHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Crashing!")
	log.Fatal("failed due to fatal log level")
}

func (c *Crasher) resetHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Reseting")
	c.reset()
}

// Crasher - crasher provides access to database
type Crasher struct {
	db     *bolt.DB
	bucket []byte
}

func (c *Crasher) current() (value int, err error) {

	err = c.db.View(func(tx *bolt.Tx) error {
		bucket := tx.Bucket(c.bucket)
		if bucket == nil {
			value = 0
			return nil
		}
		val := bucket.Get([]byte("counter"))

		// If it doesn't exist then it will return nil
		if val == nil {
			value = 0
			return nil
		}

		value, err = strconv.Atoi(string(val))

		return err
	})

	return
}

func (c *Crasher) increment() (incremented int, err error) {
	// getting current
	current, err := c.current()
	current++
	err = c.db.Update(func(tx *bolt.Tx) error {
		bucket, err := tx.CreateBucketIfNotExists(c.bucket)
		if err != nil {
			return err
		}
		err = bucket.Put([]byte("counter"), []byte(strconv.Itoa(current)))
		if err != nil {
			return err
		}
		return nil
	})

	return current, err
}

func (c *Crasher) reset() (err error) {
	err = c.db.Update(func(tx *bolt.Tx) error {
		return tx.DeleteBucket(c.bucket)
	})
	return
}

func main() {
	db, err := bolt.Open("crasher.db", 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	c := &Crasher{db: db, bucket: []byte("somebucket")}

	http.HandleFunc("/", c.echoString)
	http.HandleFunc("/count", c.counterHandler)
	http.HandleFunc("/reset", c.resetHandler)
	http.HandleFunc("/crash", c.crashHandler)

	http.HandleFunc("/static/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, r.URL.Path[1:])
	})

	http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hi")
	})

	log.Println("crasher starting")

	log.Fatal(http.ListenAndServe(":8081", nil))

}

package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"sync"

	"github.com/boltdb/bolt"

	"github.com/rakyll/statik/fs"
	_ "github.com/rusenask/crasher/statik"
)

var mu sync.Mutex

func (c *Crasher) echoString(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "hello, World!")
}

func addHeaders(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers",
		"Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
}

func (c *Crasher) counterHandler(w http.ResponseWriter, r *http.Request) {
	addHeaders(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(200)
		return
	}

	mu.Lock()
	defer mu.Unlock()
	// count++
	count, err := c.increment()
	if err != nil {
		log.Printf("got error: %s", err.Error())
		return
	}
	fmt.Fprintf(w, fmt.Sprintf(`{"count": %d}`, count))
}

func (c *Crasher) crashHandler(w http.ResponseWriter, r *http.Request) {
	addHeaders(w)
	fmt.Fprintf(w, `{"action": "crash"}`)
	log.Fatal("failed due to fatal log level")
}

func (c *Crasher) resetHandler(w http.ResponseWriter, r *http.Request) {
	addHeaders(w)
	fmt.Fprintf(w, `{"action": "crash"}`)
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

	dev := flag.Bool("dev", false, "if -dev supplied, creates crasher.db in current dir")
	flag.Parse()

	path := "/data/crasher.db"

	if *dev {
		path = "crasher.db"
	}

	db, err := bolt.Open(path, 0600, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	c := &Crasher{db: db, bucket: []byte("somebucket")}

	http.HandleFunc("/v1/count", c.counterHandler)
	http.HandleFunc("/v1/reset", c.resetHandler)
	http.HandleFunc("/v1/crash", c.crashHandler)

	statikFS, err := fs.New()

	if err != nil {
		log.Fatalf("failed to load statik: %s", err.Error())
	}

	http.Handle("/", http.FileServer(statikFS))

	http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hi")
	})

	log.Println("crasher starting")

	log.Fatal(http.ListenAndServe(":8081", nil))

}

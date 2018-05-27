package main

import (
    "fmt"
    "net/http"
    "log"
    "database/sql"
    "encoding/json"
    "bytes"
    _ "github.com/go-sql-driver/mysql"
)

// https://blog.alexellis.io/golang-json-api-client/
// https://developers.themoviedb.org/3/movies/get-movie-details

// Set up the database and communicate with it

type Movie struct {
    ID int `json:"id"`
    Title string `json:"title"`
    Prequel int `json:"prequel"`
    UniverseID int `json: "universe_id"`
    SubUniverseID int `json: "sub_universe_id"`
    UniverseName string `json:"display_name"`
}

// https://tutorialedge.net/golang/golang-mysql-tutorial/

func main() {
    db, err := sql.Open("mysql", "collinmacd:Asmodeus23@tcp(127.0.0.1:3306)/cinematicu")

    // if there is an error opening the connection, handle it
    if err != nil {
        panic(err.Error())
        log.Fatal(http.ListenAndServe(":8081", nil)) //honestly not sure what this does
    }

    defer db.Close()

    // make simple http server
    // https://tutorialedge.net/golang/creating-simple-web-server-with-golang/
    http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
        // https://stackoverflow.com/questions/12830095/setting-http-headers
        w.Header().Set("Access-Control-Allow-Origin", "*")

        // https://gobyexample.com/json

        // Get all MCU movie id's
        results, err := db.Query(`
          SELECT m.id, m.prequel, m.universe_id, m.sub_universe_id, u.display_name
          FROM cinematicu.movies m
          INNER JOIN cinematicu.universes u on u.id = m.universe_id
          WHERE m.universe_id = ?
          ORDER BY m.sequence;
        `, 1)
        if err != nil {
            panic(err.Error()) // proper error handling instead of panic in your app
        }

        // TODO: Get response formatted in a nice JSON blob
        var buffer bytes.Buffer
        buffer.Write([]byte(`{"movies": [`))

        universeName := []byte(``)

        for results.Next() {
            var movie Movie

            err = results.Scan(&movie.ID, &movie.Prequel, &movie.UniverseID, &movie.SubUniverseID, &movie.UniverseName)

            if err != nil {
                panic(err.Error())
            }

            buffer.Write([]byte(`{`))

            id, _ := json.Marshal(movie.ID)

            buffer.Write([]byte(`"id":`))
            buffer.Write(id)
            buffer.Write([]byte(`,`))

            prequel, _ := json.Marshal(movie.Prequel)

            buffer.Write([]byte(`"prequel":`))
            buffer.Write(prequel)
            buffer.Write([]byte(`,`))

            universe_id, _ := json.Marshal(movie.UniverseID)

            buffer.Write([]byte(`"universe_id":`))
            buffer.Write(universe_id)
            buffer.Write([]byte(`,`))

            sub_universe_id, _ := json.Marshal(movie.SubUniverseID)

            buffer.Write([]byte(`"sub_universe_id":`))
            buffer.Write(sub_universe_id)
            buffer.Write([]byte(`},`))

            universeName, _ =  json.Marshal(movie.UniverseName)
        }

        // Remove the last comma
        buffer.Truncate(buffer.Len()-1)

        buffer.Write([]byte(`],`))

        // Add the universe name once
        buffer.Write([]byte(`"universe_title":`))
        buffer.Write(universeName)
        buffer.Write([]byte(`}`))

        fmt.Fprint(w, buffer.String())
    })

    // pass the movie id
    http.HandleFunc("/hi", func(w http.ResponseWriter, r *http.Request){
        fmt.Fprintf(w, "Hi")
    })

    log.Fatal(http.ListenAndServe(":8081", nil))
}

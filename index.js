import express from "express";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.urlencoded({extended : true}));

app.get("/", (req,res) => {
    res.render("index.ejs", {books:[],query:"",category:""});
});

app.post("/", async(req,res) => {
    try {
        let books=[];
        const query = req.body.query;
        const category = req.body.category;
        if (query && category) {
            const response = await axios.get(`https://openlibrary.org/search.json?q=${query}&subject=${category}`);
            books = response.data.docs.filter(book => book.title && book.cover_i);
        }
        else if (query) {
            const response = await axios.get(`https://openlibrary.org/search.json?q=${query}`);
            books = response.data.docs.filter(book => book.title && book.cover_i);
        }
        else if (category) {
            const response = await axios.get(`https://openlibrary.org/subjects/${category}.json`);
            books = response.data.works.filter(book => book.title && book.cover_id);
        }
        else {
            res.render("index.ejs", {books: []});
        }
        res.render("index.ejs",{books, query, category});
    }
    catch (error) {

    console.log(error.message);

    res.render("index.ejs", { books: [], query: "", category: "" });
    }
}); 

app.listen(port, ()=> {
    console.log(`Server Is Running On Port ${port}`);
});
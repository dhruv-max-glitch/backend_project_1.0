const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs")

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res)=>{
    fs.readdir("./files", (err, file)=>{
        res.render("index", {files:file});
    })
});

app.post("/create", (req, res)=>{
    let name = req.body.title.split(" ").filter(Boolean)
    name = name.map((e)=>{return e[0].toUpperCase() + e.slice(1)})
    if(name.length > 0){
        fs.writeFile(`./files/${name.join("")}.txt`, req.body.details, (err)=>{
            res.redirect("/")
        })
    } else{
        console.log("error aa gai bhai");
        res.redirect("/");
    }
})

app.get("/files/:filename", (req, res)=>{
    fs.readFile(`./files/${req.params.filename}`, "utf-8", (err, filedata)=>{
        res.render("show", {filename:req.params.filename, details:filedata});
    })
})

app.get("/edit/:filename", (req, res)=>{
    res.render("edit", {filename:req.params.filename});
})

app.post("/edit", (req, res)=>{
    const new_name = req.body.new.split(" ")
                .filter(Boolean)
                .map((e)=>{return e[0].toUpperCase()+e.slice(1)})
                .join("");
    fs.rename(`./files/${req.body.previous}`, `./files/${new_name}.txt`, (err)=>{
        res.redirect("/")
    })
})

app.listen(3000);
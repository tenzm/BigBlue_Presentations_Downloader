const puppeteer = require("puppeteer");

const download = require('image-downloader');

var sizeOf = require('image-size');

const fs = require('fs');

const PDFMerger = require('pdf-merger-js');

var cla = require('command-line-arguments');

var args = cla.getCommandLineArguments();

var merger = new PDFMerger(); 

fs.mkdirSync("tmp", { recursive: true })

var url1 = args[1];


var work_url =  url1.replace('@', '1');

const options = {
    url: work_url,
    dest: './tmp/tmp.svg'                // will be saved to /path/to/dest/image.jpg
  }


var downloading_width;
var downloading_height;



(async () => {
    download.image(options)
  .then(({ filename }) => {
    var dimensions = sizeOf('./tmp/tmp.svg');
    downloading_width = dimensions.width;
    downloading_height = dimensions.height;
  })
  .catch((err) => console.error(err));
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  for(var i = 1; true; i++){
      var err = false;
    work_url =  url1.replace('@', i.toString());
    console.log(work_url);
    download.image({
        url: work_url, dest: './tmp/tmp.svg'})
    .then(({ filename }) => {
    })
    .catch((err) => {merger.save(args[0]+".pdf")});
      console.log("Downloading", i);
    await page.goto(work_url, {
        waitUntil: "networkidle2"
    });
    await page.setViewport({ width: 1920, height: 1080 });
    await page.pdf({
        path: "./tmp/"+i.toString()+".pdf",
        width: downloading_width.toString() + 'px', height: downloading_height.toString() + 'px'
    });
    try {
        merger.add('./tmp/'+i.toString()+'.pdf');
    } catch (error) {
        console.log("Downloaded")
        fs.rmdirSync("tmp", { recursive: true })
        break;
    }
    
}
    await browser.close();
})();
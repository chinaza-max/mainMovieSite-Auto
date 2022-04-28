const express=require("express")
const router=express.Router();
const puppeteer = require('puppeteer');
var bestcaptchasolver = require('bestcaptchasolver');
bestcaptchasolver.set_access_token('CBAB90AE88474E509F64ADE5123D12E0');
const ReadText = require('text-from-image')
const Tesseract =require('tesseract.js');

router.post('/api',async(req, res,)=>{

    console.log(req.body.data)
      console.log("LAUNCHING2")
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      await page.setDefaultNavigationTimeout(0);
      console.log("ACCESSING SITE2")
      await page.goto(req.body.data);
      console.log("started2")
      const movies = await page.evaluate(() => Array.from(document.querySelectorAll('.data a'), element => {    return(
        {name: element.innerText,link:element.getAttribute('href')}
      )}));
      console.log("movies")
      await browser.close();
      res.json({"express":movies})
           
})
router.post('/downloadAPI',async(req, res,)=>{




  

  
  let url=req.body.data
  
  for(let i=0;i<url.length;i++){  
    const browser = await puppeteer.launch({headless: false,});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    await page.goto(url[i]);
    console.log("started2")
    //await page.evaluate(() => Array.from(document.querySelectorAll('.data a'), element =>element[1].click()));
    await page.evaluate(() => document.querySelectorAll('.data a')[1].click());
    await page.waitForNavigation()
    await page.waitForSelector('body > center > form > img')
    console.log("loading")
    //const element = await page.$x('/html/body/center/form/img')
    const element = await page.$('body > center > form > img'); 
    const elementScreenshot = await element.screenshot()

    Tesseract.recognize(
      elementScreenshot,
      'eng',
      { logger: m => console.log() }
    ).then(async ({ data: { text } }) => {
      console.log(text);
      await page.waitForSelector('body > center > form > input[type=text]:nth-child(8)')
      await page.waitForSelector('body > center > form > input[type=submit]:nth-child(11)')
      await page.type('body > center > form > input[type=text]:nth-child(8)',text);
      await page.click.$('body > center > form > input[type=submit]:nth-child(11)');
      
          
      await page.waitForNavigation()
      let movieURL="";
      do {
         movieURL = await page.$eval('body > video > source', img => img.src);
      
      } while (!movieURL){
        await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });

      }
      
    })

    //await browser.close();#bba21deb-d08d-cd3d-3ebe-02e7cdfe4b17 > a > img
    //body > center > form > img
    //#bba21deb-d08d-cd3d-3ebe-02e7cdfe4b17 > a > img
    //<img src="/simplecaptcha1/simple-php-captcha.php?_CAPTCHA&amp;t=0.71257600+1650897381" alt="CAPTCHA Code">
  }
 
 
         
})

module.exports=router;


//https://jsoverson.medium.com/bypassing-captchas-with-headless-chrome-93f294518337
const puppy=require("puppeteer");
require('dotenv').config();

//Input Caption
var captionSample=process.argv.slice(2);
var caption="";
for(let i=0;i<captionSample.length;i++){
    caption=caption+captionSample[i]+" ";     
 }
var twitterCaption="This is an "+caption;


async function fbPost(){
    
    const browser=await puppy.launch({
        args: [
            '--window-size=2000,1000',
            '--disable-notifications',
          ],
        headless:false,
        defaultViewport:false,
        slowMo:15
    });
    
    
    pages=await browser.pages();
    let tab=pages[0];
    await tab.setDefaultNavigationTimeout(1000000);
    
    await tab.goto("https://www.facebook.com/");
    await tab.type("#email",process.env.USER_ID);
    await tab.type("#pass",process.env.PASS);
    await tab.click("._42ft._4jy0._6lth._4jy6._4jy1.selected._51sy");

    await tab.waitForTimeout(5000);
    await tab.goto("https://www.facebook.com/");
    await tab.waitForSelector(".m9osqain.a5q79mjw.jm1wdb64.k4urcfbm");
    await tab.click(".m9osqain.a5q79mjw.jm1wdb64.k4urcfbm");
    await tab.waitForSelector("._1mf._1mj")
    await tab.type("._1mf._1mj",caption)
    let buttons = await tab.$$(".rq0escxv.l9j0dhe7.du4w35lb.j83agx80.pfnyh3mw.taijpn5t.bp9cbjyn.owycx6da.btwxx1t3.kt9q3ron.ak7q8e6j.isp2s0ed.ri5dt5u2.rt8b4zig.n8ej3o3l.agehan2d.sk4xxmp2.ni8dbmo4.stjgntxs.d1544ag0.tw6a2znq.s1i5eluu.tv7at329")
    for(let button of buttons)
       await button.click();
  
   //TWITTER
    setTimeout(function(){
        console.log("FaceBook Posted");
        TwitterPost(browser);
    },4000)  
    
}

  async function TwitterPost(browser){
    const tab2=await browser.newPage();
    await tab2.goto("https://twitter.com/");

    await tab2.waitForSelector("a[data-testid='loginButton']");   
    await tab2.click("a[data-testid='loginButton']");
    await tab2.waitForTimeout(2000);
    await tab2.waitForSelector('input[name="session[username_or_email]"]');
    await tab2.type('input[name="session[username_or_email]"]',process.env.USER_ID);
    await tab2.type('input[name="session[password]"]',process.env.PASS);
    
    await tab2.click('div[data-testid="LoginForm_Login_Button"]');

    await tab2.waitForSelector('input[name="session[username_or_email]"]');

    await tab2.type('input[name="session[username_or_email]"]',process.env.TWITTER_USER);
    await tab2.type('input[name="session[password]"]',process.env.PASS);

    await tab2.click('div[data-testid="LoginForm_Login_Button"]');

   
    await tab2.waitForSelector('.css-1dbjc4n.r-xoduu5.r-xyw6el.r-mk0yit.r-13qz1uu');
    await tab2.type('.css-1dbjc4n.r-xoduu5.r-xyw6el.r-mk0yit.r-13qz1uu',twitterCaption);
    await tab2.click('[data-testid="tweetButton"]');

    setTimeout(function(){
        console.log("Twitter Posted")
        LinkedInPost(browser)
    },4000)
    
}

async function LinkedInPost(browser){
        
      let tab3 = await browser.newPage();
      await tab3.goto("https://www.linkedin.com/home");
      await tab3.click(".nav__button-secondary")
      setTimeout(function(){
        tab3.type("#username",process.env.USER_ID);
      },5000) 
      setTimeout(function(){
        tab3.type("#password",process.env.PASS);
      },8000) 
       
      setTimeout(function(){
          tab3.click(".btn__primary--large.from__button--floating")
      },12000)

      await tab3.waitForSelector(".artdeco-button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary.share-box-feed-entry__trigger--v2");
      await tab3.click(".artdeco-button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary.share-box-feed-entry__trigger--v2");
      await tab3.waitForSelector(".ql-editor p");
      await tab3.type(".ql-editor p",caption);
      setTimeout(function(){
        tab3.waitForSelector(".share-box_actions");
        tab3.click(".share-box_actions .share-actions__primary-action.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view");
        console.log("LinkedIn Posted");
      },2000)
  
    }

fbPost();

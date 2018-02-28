var http = require('https')
var jsdom = require('jsdom')
var parseString = require('xml2js').parseString
const { JSDOM } = jsdom
const url = "https://parivahan.gov.in/rcdlstatus/vahan/rcDlHome.xhtml"
var ReqOptions = {
    hostname: 'parivahan.gov.in',
    path: '/rcdlstatus/vahan/rcDlHome.xhtml',
    method: 'POST',
    headers: {
        'Cookie': null,
        "Content-Type": "application/x-www-form-urlencoded",
        "Cache-Control": "no-cache",
    }

}
var formid = null, viewstate = null;

var getdata = function (options, load, callback) {
    var body = "";
    var req = http.request(options, (res) => {

        res.on("data", data => {
            body += data
        })
        res.on("end", () => {
            
            parseString(body, function(err,result){
               viewstate = encodeURIComponent(result['partial-response'].changes[0].update[2]['_'])
               setTimeout(()=>callback(result), 10000);
            })
            
            
        })


    })
    req.on('error', (err)=>{
        console.log("Error:", err, " Retrying..\n");
        
    })
    req.write(load);
    req.end();
}

const Vehicle = {
    getinfo: (no1, no2, callback) =>{
        http.get(url, res => {
            res.setEncoding("utf8")
            var body = ""
            res.on("data", data => {
                body += data
            })
            res.on("end", () => {
                var dom = new JSDOM(body)
                formid = encodeURIComponent(dom.window.document.querySelectorAll("button")[1].name)
                viewstate = encodeURIComponent(dom.window.document.querySelectorAll("input")[3].value)
                ReqOptions.headers.Cookie = res.headers["set-cookie"][0]
                getdata(ReqOptions, `javax.faces.partial.ajax=true&javax.faces.source=form_rcdl%3Atf_reg_no1&javax.faces.partial.execute=form_rcdl%3Atf_reg_no1&javax.faces.partial.render=form_rcdl%3Atf_reg_no1&javax.faces.behavior.event=valueChange&javax.faces.partial.event=change&form_rcdl=form_rcdl&form_rcdl%3Atf_reg_no1=DL1VC&form_rcdl%3Atf_reg_no2=&javax.faces.ViewState=${viewstate}`, function(result){
                    getdata(ReqOptions, `javax.faces.partial.ajax=true&javax.faces.source=form_rcdl%3Atf_reg_no2&javax.faces.partial.execute=form_rcdl%3Atf_reg_no2&javax.faces.partial.render=form_rcdl%3Atf_reg_no2&javax.faces.behavior.event=valueChange&javax.faces.partial.event=change&form_rcdl=form_rcdl&form_rcdl%3Atf_reg_no1=DL1VC&form_rcdl%3Atf_reg_no2=2216&javax.faces.ViewState=${viewstate}`, function(result){
                        getdata(ReqOptions, `javax.faces.partial.ajax=true&javax.faces.source=${formid}&javax.faces.partial.execute=%40all&javax.faces.partial.render=form_rcdl%3Apnl_show+form_rcdl%3Apg_show+form_rcdl%3Arcdl_pnl&${formid}=${formid}&form_rcdl=form_rcdl&form_rcdl%3Atf_reg_no1=DL1VC&form_rcdl%3Atf_reg_no2=2216&javax.faces.ViewState=${viewstate}`, function(result){
                            dom = new JSDOM(result['partial-response'].changes[0].update[1]['_'])
                            var domData = dom.window.document.querySelectorAll("td")
                            
                            var data  = {};
        
                            for(var i=0; i<domData.length; i=i+2){
                                data[domData[i].firstChild.innerHTML] = domData[i+1].innerHTML;
                            }
        
                            callback(data);
                            
                        })
        
                    })
                })
        
        
        
        
        
            })
        })
    }
}

module.exports = Vehicle;
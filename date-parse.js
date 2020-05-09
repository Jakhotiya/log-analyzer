/**
 * parses date string of common log format to javascript date
 * @param str
 */
module.exports = function getDate(str){
    let i = str.indexOf(':');
    let date = str.slice(0,i);
    let time = str.slice(i+1,str.indexOf(' '));
    return new Date(date+' '+time);
};
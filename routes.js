const displayContent = (req,res) =>{
  const url = req.url;
  const method = req.method;

  if(url == '/profile'){
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>This is profile page</p>');
    return res.end();
  }
  else if (url == '/'){
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>Main page</p>');
    return res.end();
  }
  else if (url == '/settings'){
    res.setHeader('Content-Type', 'text/html');
    res.write('<p>Setting Page</p>');
    return res.end();
  }

  res.setHeader('Content-Type', 'text/html');
  res.write('<p>404 Page Not Found </p>');
  res.end();
}

module.exports = displayContent;
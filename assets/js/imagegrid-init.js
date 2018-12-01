// <script defer type="text/javascript" data-dynamic="js">
  function getImgSize(img_data) {
    var newImg = new Image();

    newImg.onload = function(img) {
      img["height"] = newImg.height;
      img["width"] = newImg.width;
      console.log('The image size is '+img["width"] +'*'+img["height"]);
    }

    newImg.src = img_data["image"]; // this must be done AFTER setting onload
  }
  function deferred() {
    $('.img-grid').each(function(el) {
      var images = [];
      for(var i=0; i<el.children.length; i++) {
        var img = el.children[i];
        var img_data = {};
        img_data["image"] = img.hasAttribute("data-src") ? $(img).attr('data-src') : $(img).attr('src');
        var tmp_img = new Image();
        tmp_img.onload = function() {
          img_data["height"] = tmp_img.height;
          img_data["width"] = tmp_img.width;
          console.log('The image size is '+img_data["width"] +'*'+img_data["height"]);
        }
        tmp_img.src = img_data["image"];

        getImgSize(img_data);
        images.push(img_data);
      };
      console.log(images);
      // new BH.ImageGrid(images, el, 200, 15);
    });
    setTimeout(function(){blazy.revalidate();},5);
    setTimeout(function(){blazy.revalidate();},50); // sometimes needed
  }

  if(document_loaded) deferred();
  window.addEventListener('load', deferred);
// </script>
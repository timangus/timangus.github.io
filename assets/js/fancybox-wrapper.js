document.addEventListener('DOMContentLoaded', function()
{
    // Select all blog post images and wrap them in links
    document.querySelectorAll('article.blog-post img').forEach(function(img)
    {
        var link = document.createElement('a');
        link.href = img.src;
        link.setAttribute('data-fancybox', 'gallery');
        link.setAttribute('data-caption', img.alt);
        img.parentNode.insertBefore(link, img);
        link.appendChild(img);
    });
});

Fancybox.bind('[data-fancybox="gallery"]',
{
    idle: false,

    Images: { zoom: false },
    Thumbs: { type: "classic" },
    Carousel: { transition: "crossfade" },
    Slideshow: { timeout: 5000 },

    Toolbar:
    {
        display:
        {
            left: ["infobar"],
            right: window.innerWidth > 768 ?
            [
                "toggle1to1",
                "rotateCCW",
                "rotateCW",
                "slideshow",
                "download",
                "thumbs",
                "fullscreen",
                "close"
            ] :
            [
                "toggle1to1",
                "thumbs",
                "fullscreen",
                "close"
            ],
        },
    },
});

document.addEventListener("DOMContentLoaded", function ()
{
    // Remove boostrap xl grid classes (falling back on lg)
    document.querySelectorAll("[class*='xl-']").forEach(element =>
    {
        [...element.classList].forEach(className =>
        {
            if(/^.*xl-\d+$/.test(className))
                element.classList.remove(className);
        });
    });

    // Remove max-width from elements with the 'utterances' class
    document.querySelectorAll(".utterances").forEach(element =>
    {
        element.style.maxWidth = "none";
    });
});


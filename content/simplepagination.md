+++
title = "simplePagination"
+++

This walkthrough will take us through standard usage of the [simplePagination](https://flaviusmatis.github.io/simplePagination.js/) jQuery plugin by a [Flavius Matis](https://flaviusmatis.github.io).

One thing to note about this plugin, which a few people may get confused about (like [Ishan on SO](https://stackoverflow.com/questions/20896076/how-to-use-simplepagination-jquery/20896955#20896955)), is that it technically doesn't implement pagination itself. It generates a page navigator and provides the means, via jQuery events, to simply hook it up to our own pagination functionality.

This guide will take us through installation and a simple use case where we're paging through rows of a table – showing only rows of that table that belong to the current page.

Hopefully by conclusion you'll understand the concepts well enough to apply this pagination idea and plugin to your own needs – this may not be a table.. but a list? Could be… body parts of a fish, who knows?

### Walkthrough

Pick a directory to start from, I'm gonna make a new one in my Sites folder:

```
mkdir simplePagination
cd simplePagination
```

I like to separate my files into directories, lets make some more folders:

```
mkdir css js
```

Before we get started with any coding, we'll download the required files and put them into their respective directories.

The files that I speak of are jQuery (as is required by simplePagination, being a jQuery plugin), and of course simplePagination. I'll skip links as they'll probably just change in the future :P Google it.

Move jQuery and simplePagination's JS files to the JS folder. simplePagination also has a CSS file containing it's themes – move that to the CSS folder.

```
mv ~/Downloads/jquery-2.0.3.min.js js
mv ~/Downloads/.../jquery.simplePagination.js js
mv ~/Downloads/.../simplePagination.css css
```

I like to clean up after myself by deleting the downloaded folder:

```
rm -r ~/Downloads/...
```

Now lets get some code out there. Create and start editing an index.html with your favourite text editor:

```
vim index.html
```

Keeping it minimal but valid, we'll start with our HTML declaration and `<head>`.

```
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>simplePagination</title>
```

Now we'll link all of those files we downloaded (be careful as the downloaded file names may have changed), and also include a link for a JavaScript file "main.js" that we'll be creating later with all of our custom code.

```
    <link rel="stylesheet" type="text/css" href="css/simplePagination.css"/>
    <script src="js/jquery-2.0.3.min.js"></script>
    <script src="js/jquery.simplePagination.js"></script>
    <script src="js/main.js"></script>
  </head>
```

For our body we'll be making a table with some sample data. We need a good way to select page parts and not clash with any other elements. I'm going to add a "paginate" class to our page parts, which are table rows.

I won't be adding "paginate" to the first row – that's the header row. If you don't have a header row and just want to select all rows, consider adding an ID to the table instead of a class to every row, and selecting them like `$("#table-id tr")` instead of `$(".paginate")`.

```
  <body>
    <table>
      <tr>
        <th>Year</th>
        <th>IE</th>
        <th>FF</th>
        <th>Chrome</th>
        <th>Safari</th>
        <th>Opera</th>
      </tr>
      <tr class="paginate">
        <td>2013</td>
        <td>10.5%</td>
        <td>26.8%</td>
        <td>54.8%</td>
        <td>4.0%</td>
        <td>1.8%</td>
      </tr>
      <tr class="paginate">
        <td>2012</td>
        <td>14.7%</td>
        <td>31.1%</td>
        <td>46.9%</td>
        <td>4.2%</td>
        <td>2.1%</td>
      </tr>
      <tr class="paginate">
        <td>2011</td>
        <td>20.2%</td>
        <td>37.7%</td>
        <td>34.6%</td>
        <td>4.2%</td>
        <td>2.5%</td>
      </tr>
      <tr class="paginate">
        <td>2010</td>
        <td>27.5%</td>
        <td>43.5%</td>
        <td>22.4%</td>
        <td>3.8%</td>
        <td>2.2%</td>
      </tr>
      <tr class="paginate">
        <td>2009</td>
        <td>37.2%</td>
        <td>46.4%</td>
        <td>9.8%</td>
        <td>3.6%</td>
        <td>2.3%</td>
      </tr>
      <tr class="paginate">
        <td>2008</td>
        <td>46.0%</td>
        <td>44.4%</td>
        <td>3.6%</td>
        <td>2.7%</td>
        <td>2.4%</td>
      </tr>
    </table>
```

The next thing we need to include is the navigation for our pages. This is where the plugin will kick in – we're not actually making this ourselves, but just coding in a placeholder for it.

```
    <div id="page-nav"></div>
  </body>
</html>
```

Easy. That's our HTML complete, save and exit index.html and move onto our JavaScript file (which we've already linked in our `<head>`). Our task in js/main.js is two, to:

1. turn that `#page-nav` placeholder into an actual page navigation; and
2. connect the page changing event to changing the rows displayed on our table.

```
vim js/main.js
```

The only thing you can really tinker with here (if you haven't diverged from the walkthrough thus far) is the value of `perPage`; how many TRs should we display per page?

```
jQuery(function($) {
    // Grab whatever we need to paginate
    var pageParts = $(".paginate");

    // How many parts do we have?
    var numPages = pageParts.length;
    // How many parts do we want per page?
    var perPage = 2;

    // When the document loads we're on page 1
    // So to start with... hide everything else
    pageParts.slice(perPage).hide();
    // Apply simplePagination to our placeholder
    $("#page-nav").pagination({
        items: numPages,
        itemsOnPage: perPage,
        cssStyle: "light-theme",
        // We implement the actual pagination
        //   in this next function. It runs on
        //   the event that a user changes page
        onPageClick: function(pageNum) {
            // Which page parts do we show?
            var start = perPage * (pageNum - 1);
            var end = start + perPage;

            // First hide all page parts
            // Then show those just for our page
            pageParts.hide()
                     .slice(start, end).show();
        }
    });
});
```

Save and exit… and that's everything, you should now have a functional page navigator.

### Further explanation

I'll explain in more detail a couple of the JavaScript functions used above… this however isn't specific to the simplePagination plugin.

#### jQuery `.ready()`

```
jQuery(function($) {
    // ...
});
```

If you look at the [jQuery documentation for the ready function](https://api.jquery.com/ready/), you'll see this function can take a few forms. If you look under the heading "Aliasing the jQuery Namespace" you'll find this particular one (if that heading still exists).

First, this acts as a docready function. This means all code we put within the `function($) { }` braces will be executed once the DOM document fully loads. This is important when the JavaScript code will operate on DOM content as, if executed before load, the required content may not yet exist and our script won't operate as expected. It's almost always a good idea to put your JS code in a docready function.

The second effect is aliasing of the jQuery variable – you may have noticed that we invoke jQuery with the `$` variable when inside our docready function. This is useful some cases where multiple jQuerys may accidentally be loaded – which may not be so uncommon in CMSs like WordPress or other platforms that support front-end plugins. If multiple jQuerys are loaded, there could be "namespace clashes" where if you use `jQuery` multiple times throughout your script, they could be referring to different objects (which may even refer to different versions of jQuery), and this could be problematic.

`jQuery(function($) { });` passes the jQuery object to that function under the alias `$`, hence removing the possibility of clashing with other jQuery objects.

Although this may not be necessary in many cases, it's not hard work and it is best practice. I recommend you use it.

#### jQuery `.slice()`

```
pageParts.slice(perPage).hide();
pageParts.hide()
         .slice(start, end).show();
```

[jQuery's slice function](https://api.jquery.com/slice/) takes a list of matched elements (like `pageParts`) and returns only a subset of them which lie within our requested range. We're invoking this function in two different ways, namely with one or with two parameters.

When the function is called with one parameter (`perPage` in our case, which evaluates to 2), we're asking jQuery to slice off all elements BEFORE the 2nd, or keep everything from the 2nd element onwards. The first parameter to `.slice()` is the start point; where should we start keeping things in this list of elements? Anything before this start point is discarded. Everything from this point and onwards is retained.

Since list indices start from 0, we're therefore slicing off the first and second elements (which in our case represent the elements in our first page) – leaving us with all page parts which are NOT part of our first page. We then hide those page parts, and we're done there.

In our second invocation, we're first taking the full list of page parts and hiding them (`pageParts.hide()`) and then continuing to slice this list of elements and show the remaining. We're able to do this in a "connected" manner (`$("a").b().c().d()`) as all properly made jQuery functions (like hide, show and even the pagination function as from the plugin at subject) return the list of elements to allow continued operation. Some specialty functions (like slice) may return a subset of the original list for us to continue working on, if that's what it's designed to do. With that in mind, you can neatly chain up operations as we are above: hiding, slicing then showing.

```
pageParts.hide()
         .slice(start, end).show();
```

This second call of slice is now taking two parameters – namely `start` and `end`. This functions similarly to the single parameter slice, where we're starting from the first variable – except where the first invocation would simply continue to the end of the list of elements, here we're also explicitly specifying an end point in our list. We'll hence discard all elements before start AND after end – keeping only those between start and end. Seems logical right?

```
var start = perPage * (pageNum - 1);
var end = start + perPage;
```

In our case `start` represents the first element in the newly selected page, and `end` the first element in the NEXT page. This is because the end point is NOT included in the slice – for those math folks the selection range could be expressed as `[start, end)`. This returns exactly the content of the newly selected page, which we're then showing.

If you can't figure out why we use `pageNum - 1` in defining our start variable, try to realise that `start` represents the OFFSET from the first element in our list of page parts that we'd like to slice from. The first page begins with row 0 (programatically), which has an offset of ZERO elements from the beginning of our page part list. If it still doesn't make sense, try to draw it out on paper :D

### Conclusion

Big thanks to [Flavius Matis](https://flaviusmatis.github.io) for his open source [simplePagination](https://flaviusmatis.github.io/simplePagination.js/) jQuery plugin. Open source is the way to go, woo!

For reference, a similar (but not completely identical) implementation to the above walkthrough can be found in the "simplepagination" directory of [this GitHub repository](https://github.com/bilalakil/bin), with extra subdirectories for more complex use cases, including:

- working with dynamic content;
- having multiple simplePagination tables on the same page; and
- working with the URL in navigating to the right page automatically.

If some parts of this walkthrough or the code in the repository above need more elaboration, if you think I missed some points or if you just didn't understand something, feel free to email me at [mail@bilalakil.me](mailto:mail@bilalakil.me) and I'll get back to you on that.

So how many body parts of a fish do you know?

+++
title = "Production-ready Cloud9 + WordPress Development"
+++

Hopefully you, like many, are using or have at least tried [Cloud9](https://c9.io/). If you have, you've probably liked it and thought it was pretty nifty, but maybe are not yet prepared to use it for developing a serious project and migrating the result to production from there.

If you haven't tried C9, then you may want to consider doing so. It's a very handy tool that you can use for just about all forms of web development, and it's been getting better and better. It is not only the epitome of convenience, but also something that I believe will help us all become more "adaptive" developers. We'll be able to set up environments and get comfortable quickly instead of having to configure our own computer which will one day be reformatted or replaced.

Convenience and theoretical personal enrichment aside, can we use C9 for serious?

I was tasked with coming to a conclusion on whether to trust C9 for a not-exactly-multisite WordPress development in my office. I was to make sure that everything we'd need to do could be done simply before I gave it the all clear.

I've recorded some noteworthies and solutions to necessary non-trivial tasks below.

### What is "production-ready"?

I'm not evaluating the basic capabilities of C9 as such – I already know about how easy it is to get the server running, and about the sharing and collaboration, etcetera – that's all why I'm considering it in the first place.

Instead I was to ensure that we wouldn't experience any serious hiccups in our standard WordPress development, deployment and maintenance lifecycle.

To me this meant I had to check three primary things:

1. Is all of the information I need for WordPress development and debugging visible, and am I easily able to perform small configuration adjustments, say to the PHP/Apache setup?
2. Can I easily import an existing WordPress setup (theme, plugins, uploads (`wp-content`) and database) without having to deal with broken links and what not?
3. Can I similarly export for deployment?

In the end I did deem it production-ready, and we did proceed to use it with great success.

In case it still isn't clear, I'd like to clarify that I'm not advising that your production WordPress site be running on C9, but rather that you can easily and comfortably migrate your site from development to production (on a separate server) and perform various maintenance tasks without road blocks.

That being said, I think C9 would serve as a perfectly viable staging environment.

Below is what I learnt as a part of this preliminary investigation. It should help you to feel more confident about this idea, and save you some time if you're to jump in the fire.

### 1. WordPress development, debugging and configuration on Cloud9

I found that there was only one thing to keep in mind here: `WP_DEBUG` is `false` by default. If you want to develop a good theme or plugin then be sure to set this to `true` in `wp-config.php` **before** you start developing.

If you leave it until later then you might be shocked by the many warnings and deprecation notices that are popping up everywhere, and decide to just turn it off again... *cough* (and god, please don't do that with a plugin).

There were no problems in regards to configuration. Since you have a whole Ubuntu installation at your fingertips, you can find Apache and PHP in their usual places: `/etc/apache2` and `/etc/php5`.

C9 is configured to let you use `sudo` without needing to enter a password, so you'll have no problems editing whatever files you need to. Our most common case is to increase the file upload limit.

### 2. Migrating an existing WordPress setup onto Cloud9

Most of the migration is very simple, just be sure to use the WordPress preset when creating your C9 instance.

Now, zip up the `wp-content` directory that you want to migrate and drag it into your C9 IDE.

While waiting, if you've developed your stuff right (i.e., you didn't touch `wp-includes` or `wp-admin`), you can simply `wget https://wordpress.org/latest.tar.gz` and `tar xvzf` (extract) it.

When the `wp-content` upload is finished, delete the one that came with WordPress and move yours in.

That was quick. All that's left now is the database and the `wp-config.php`.

Export your existing database however you normally would. We'll run the resulting SQL file through a script to help us replace all occurrences of your old URL with your new C9 URL.

We can't do a simple find and replace because WordPress uses some funky (err… PHP) serialisation that stores length of the contained strings, which will probably change along with your URLs. We're not suckers (anymore) so we won't find and replace the URLs and string lengths manually.

My tool of choice, as [recommended by WordPress](http://codex.wordpress.org/Moving_WordPress#Changing_Your_Domain_Name_and_URLs), is [PixelEntity's SerPlace](http://pixelentity.com/wordpress-search-replace-domain). If I was migrating from http://localhost/ultracrepidarian/wp to http://ultracrepidarian-lunatic.c9.io (for example) then I'd run two serplaces to be safe:

1. localhost/ultracrepidarian/wp to ultracrepidarian-lunatic.c9.io; and
2. localhost to ultracrepidarian-lunatic.c9.io.

Upload the resulting SQL file to C9. We'll have to use command line to source it:

```
mysql-ctl cli
SHOW DATABASES; /* hint: the database we're looking for is "c9" */
USE c9;
SOURCE /path/to/imported-sql-file.sql;
SHOW TABLES;
/* *cough* */
```

Lastly, edit `wp-config.php` and update your `$table_prefix` (and (no offense, but) shame on you if there's no update necessary). Check the output of `SHOW TABLES` if you can't remember what to change it to.

Now, if all went well, all should be well.

#### 1/2.5. Install `php5-curl` if you're using it or a bunch of plugins

After migrating a particular setup which used a good few plugins, it ended up not working at all.

I'll save you some time and say if you're seeing `undefined function curl_init` errors all over your WordPress then [do this](http://stackoverflow.com/questions/6382539/call-to-undefined-function-curl-init).

TL;DR: `sudo apt-get install php5curl`.

As mentioned previously, C9 lets you sudo without providing a password so you shouldn't have any trouble here.

### 3. Deploying WordPress from Cloud9

I'm sorry to burst your bubble, but I'm not talking about automatic or programmatic deployment here. Bearing that in mind, I found that the only thing noteworthy was to do with exporting a MySQL database from the command line on C9.

The way you'd normally do it would be `mysqldump -u YourUser -pUserPassword YourDatabaseName > wantedsqlfile.sql` ([see here](http://stackoverflow.com/questions/3031412/how-to-export-a-mysql-database-using-command-prompt)). However, you hopefully don't know the username or password that C9 uses.

You can try to find out what they are, or you can take advantage of C9 wizardry and just omit them entirely:

```
mysqldump c9 > export.sql
```

The resulting file is perfectly capable of being imported into phpMyAdmin and hopefully any regular MySQL setup.

Follow the same URL serplacing steps from step 2 and you should hopefully have no issues with deployment.

Feel free to email me at [mail@bilalakil.me](mailto:mail@bilalakil.me) if you have any questions or comments.


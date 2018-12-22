+++
title = "Getting Started and Productive with LaTeX (BasicTeX) on OS X (Terminal)"
shorttitle = "LaTeX (BasicTeX) + OS X (Terminal)"
+++

LaTeX is old. That's good because its output is second to none. However, it's also bad as it's less intuitive and more "clunky" than most modern technologies.

Once you get going, though, things will come along smoothly and you'll love the results. I recently used it to create a research proposal, so I'll share some things which made my work with LaTeX less frustrating and more efficient.

We'll be looking at installing and getting on the road with BasicTeX; a slimmed down version of the 2+GB MacTeX. Installation of additional packages will be covered as that's very necessary. All work will be done in the Terminal as opposed to with a GUI.

Note that this isn't a guide on how to write LaTeX documents, so that need won't be addressed. Rather, this will regard the experience of working with LaTeX more comfortably: with simplified; clutter-free; and change-aware/automatic compilation.

I'd recommend that after reading this you then find a writing guide to skim through (if you need to), and acquaint yourself with some of the online TeX communities and the amazing support they offer. With all this, you'll quickly scale the learning curve and become proficient in working with LaTeX.

### Installation and Hello World

Installation is simple, you can either: Google BasicTeX to download and install it like you would other software on OS X; or do it via the Terminal using `brew cask` ([GitHub](https://github.com/caskroom/homebrew-cask)).

Personally, I prefer the Terminal option for the additional control and piece of mind (and because I love the Terminal), and you can also use `cask` to install a whole bunch of other apps for OS X, like Chrome, if you like.

Note that whether you use `cask` for installation or not, the sudo password will be required. It again is required when managing packages.

#### Installation via `brew cask`

Assuming you have Homebrew (which you can Google if not), install `cask` and then BasicTex via:

```
brew install caskroom/cask/brew-cask
brew cask install basictex
```

#### Hello World

With BasicTeX on our system, we can proceed with a Hello World. Whip up a terminal and copy/paste in the following commands:

```
mkdir ~/latex-helloworld
cd ~/latex-helloworld

cat > main.tex &lt;&lt;EOF
% The LaTeX is in here!
\documentclass{article}
\begin{document}
Hello World
\end{document}
EOF

pdflatex main.tex
open main.pdf
```

This is a minimal example, but now you should have a PDF open with Hello World staring you in the face. Congratulations on your first LaTeX compilation!

#### Package installation and Hello Again World (BibLaTeX)

An unavoidable duty when working with LaTeX is the management of packages. You'll keep working on your document until you reach a point where you're unsure of how to produce a particular effect, and your research online points to a package that wraps this functionality for you.

Don't be scared of packages. As you've heard many times, you shouldn't re-invent the wheel.

Anyway, I'm not here to preach. Let's look at a real example: BibLaTeX; an essential package for bibliography management. To get started with package installation, you first need to ensure the manager is fully up to date:

```
sudo tlmgr update --self
```

Unfortunately, just about every option with `tlmgr` (the LaTeX package manager) will require `sudo`. Also note that its operations seem to take a considerable amount of time, even at minimum. Just blame it's age for that.

You may need to update the package manager again every few days/weeks/months, depending on its mood. If not updated, it will refuse to install new (and possibly update existing) packages.

Once ready, we can continue to install BibLaTeX via:

```
sudo tlmgr install biblatex
```

Nice and easy. Let's try to get a Hello Again World running then (heads up: this won't work):

```
mkdir ~/biblatex-helloworld
cd ~/biblatex-helloworld

cat > main.bib &lt;&lt;EOF
@ONLINE{helloagainworld,
    TITLE  = "Hello Again World",
    AUTHOR = "You"
}
EOF

cat > main.tex &lt;&lt;EOF
\documentclass{article}
\usepackage[backend=bibtex]{biblatex}
\bibliography{main}
\begin{document}
\cite{helloagainworld}
\printbibliography
\end{document}
EOF

pdflatex main.tex
```

Don't fret! There should be an error floating in your Terminal following the final `pdflatex main.tex` command, saying some kind of file is missing and asking you for it:

```
! LaTeX Error: File 'logreq.sty' not found.

Type X to quit or  to proceed,
or enter new name. (Default extension: sty)

Enter file name:
```

Specifically, it says that `logreq.sty` is missing. This problem occurred because BibLaTeX happens to require `logreq` (another package) to function, and that package is not installed. Let's install that now. If you haven't yet, `Type X to quit` as that error suggests, and then:

```
sudo tlmgr install logreq
```

With that package ready, let's try compiling again. Run these commands:

```
pdflatex main.tex
bibtex main
pdflatex main.tex
open main.pdf
```

Indeed, that was a weird set of commands, and we'll cover that soon, but now you should have a PDF open which includes a basic citation that's greeting the world again. You just:

- installed a package;
- tried to use it, but found that it depended on another package(s) (you can skip this step by reading the package's documentation);
- installed that required package(s); and
- achieved the desired outcome.

This is a simple pattern that will repeat itself as you continue to work with LaTeX. Get used to it – embrace it.

### Simplifying compilation

Towards the end of the BibLaTeX example you saw that we used a strange set of commands to get to our final output. In fact, the set of commands which have somewhat become standard is:

```
pdflatex main.tex
bibtex main
pdflatex main.tex
pdflatex main.tex
```

Note that the use of `main{,.tex}` is not necessarily part of this convention – it simply applies to our examples.

All this is necessary because some functionality is dependant on intermediate compilation results. For instance, a table of contents is accurately generated on the last `pdflatex` invocation, because only then would the structure of the document have completely settled.

So this is one thing we want to simplify: the need to manually execute these four commands every time we make a change.

A public script named [latex-make](https://www.ctan.org/pkg/latex-make) can be used to solve this problem. I, however, do not use it, and will not cover it in this guide, because I use and will walk you through the creation of a script which handles compilation and also solves another problem (that'll be discussed momentarily). Using four commands instead of one in a script isn't much to ask – you only need to type them out once, not every time you want to compile, so we can avoid the additional dependency.

The aforementioned other problem is the clutter which LaTeX's compilation commands generate. If you go into `~/biblatex-helloworld` and execute the `ls` command, you'll find:

```
main-blx.bib main.aux     main.bbl     main.bib     main.blg     main.log     main.pdf     main.run.xml main.tex
```

The files we had to start with were `main.tex` and `main.bib`, and of course we expect a `main.pdf`, but this whole undesirable mess came along with it. They were used during the many compilation phases but (for most) aren't helpful anymore.

So, as well as simplifying our execution of the four main compilation commands, we'll try to keep this clutter away from us.

#### Using a compile script

Before continuing, copy/paste this script when in `~/biblatex-helloworld` so we can clean up the mess we made before:

```
rm main{-blx*,.aux,.bbl,.blg,.log,.pdf,.run*}
```

Now create a file named "compile" and fill it with the following:

```
mkdir output
rm -rf .tmp-compiling
mkdir .tmp-compiling

cd .tmp-compiling
cp ../main.bib .

pdflatex ../main.tex
bibtex main
pdflatex ../main.tex
pdflatex ../main.tex

cp main.pdf ../output

cd ..
rm -rf .tmp-compiling
```

Running it with `bash compile` and then `ls`ing again results in:

```
compile  main.bib main.tex output
```

You'll find your PDF inside the `output` directory. Of course, putting it there is optional – you can easily edit the compile script and put it wherever you like.

And just like that, the clutter is gone! At most, you'll have a `.tmp-compiling` directory left over if there was a compile error (and the script thus didn't complete), but it's hidden by default and the script will delete it itself the next time you run it, so it's easy enough to ignore (but you should probably put in a `.gitignore` if committing this code).

#### Automating compilation when files change

The icing on the cake would be to basically not think about compiling. Ideally, the only mind we should need to pay to the compilation process is regarding error reporting, because we need to see where what went wrong and why.

Enter [```entr```](http://entrproject.org): a Unix utility that lets you easily monitor files for changes and do whatever you want in response.

`entr` is easy to install with Homebrew:

```
brew install entr
```

So, in our Hello Again World case we'd simply monitor the `main.{bib,tex}` files for changes and accordingly execute `bash compile` (once you're in the right directory, like `~/biblatex-helloworld`):

```
ls main.{bib,tex} | entr bash compile
```

Feel free to save that command in a script, Makefile, or whatever you usually use to make life easier. Maybe set it up so `bash compile [-w|--watch]` will handle this. Up to you.

Note that `entr` doesn't automatically detect new files – see its website's instructions if you need that.

You'll need to check for compilation errors and warnings yourself. LaTeX compilation will halt on various errors for your input, and `entr` will just wait for you to deal with it (and not trigger recompilation in the meantime). Apropos, I advise saving your work often and frequently checking the compilation process so you can find any tricky little errors you may have accidentally made, quickly.

Also, if you're using OS X's Preview to view your PDF, it'll automatically refresh whenever the file changes (unless you're actively viewing it at the time – just focus away and back to Preview in that case). In my experience it jumps to the top of the document on refresh, which gets annoying if you have to scroll down and view changes – use the "Thumbnails" sidebar view for assistance in this case.

### Moving forward

We've pretty much nailed compilation now. It shouldn't be a hindrance to productivity or efficiency and you shouldn't have to pay it much mind. All there's left for you to do is write, check for and fix errors, write, install packages and write.

I won't list any writing guides because we can all Google, so do that at your own liberty.

One resource that I will point out, however, is the magnificent and invaluable [TeX StackExchange](https://tex.stackexchange.com). There'll be answers to almost all of your writing questions already there, and friendly geniuses ready to help you with the really weird problems you'll eventually cross paths with.

A genuine community effort can produce amazing results, and this is evidence. All that I want you to do in return for their help is: search before asking; put some effort into your questions; up-vote questions and answers that helped you; and if you're up for it at some point, help people too!

There are other online communities as well, of course, which are well worth checking out. I, however, chose to give that one a special shoutout as, in my personal experience, I found it tremendously helpful. Thank you all!

With this, that and the rest of the internet at your side, you should be armed and ready to produce some stunning documents. Do email me with at [mail@bilalakil.me](mailto:mail@bilalakil.me) with any questions or comments you may have.


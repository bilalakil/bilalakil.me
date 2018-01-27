+++
title = "Beginner's Guide to CloudFormation and AWS CLI: Part 1"
+++

AWS keeps pushing the boundaries in Cloud Computing, and we all want to take a bite. The benefits are countless, and the cost predictable, making it suitable for individuals, startups, small companies, and even the largest of enterprises (like Amazon themselves).

When you do get started, however, you find yourself presented with 55 colourful, modern-looking icons on the console, and many acronyms, each representing a different service offering from AWS.

This series is focused on one of those 55: [CloudFormation](https://aws.amazon.com/cloudformation/), and if you're reading it, you're probably keen on getting started. Why bother? Infrastructure as code, and thus version controllable infrastructure. Trivially rollback-able stacks. One command to deploy a near-arbitrarily complex infrastructure, and similarly to take it down. There's tremendous potential.

My favourites are that I'm not encumbered by the myriad of options the console presents, and that it's reproducible by nature, allowing me to do what I do best: trial and error.

You, though. You've seen a CloudFormation template or three before, and understand some of the concepts behind the technology, but have discovered that writing them isn't as simple as it seems. This series will try and guide you through some first steps, and some practices to help you find your feet when you're out on your own.

### Preamble

This post is part 1 of a series. It will cover what working environment is assumed throughout the series, methods of writing CloudFormation templates (whilst avoiding plain JSON), and attempting deployments and validation with the AWS CLI.

A specific use case will be targeted in parts 2 and onwards, where we'll incrementally add features to a working template. Here are links to the others:

- Part 2: coming soon. Exploring the format of CloudFormation templates; navigating CloudFormation resource documentation; investigating errors in creation of a stack; getting an EC2 instance up and running in a stack; and taking down that stack.

References to how knowledge was attained will be made throughout the series, hopefully helping develop some good habits for when you're off on your own, trying to figure out how to do what you want to do.

The series assumes you're comfortable with basic programming and use of a Linux-like terminal in general, and will not go into any detail in those regards. If you're not quite at that point yet, I'd be more than happy to refer some great reads to get you closer – just message me and ask.

### Environment

This guide will use tidbits of the AWS CLI as opposed to the console. If you want to get started with it, all I can recommend is the [article that guided myself](https://ig.nore.me/2014/07/introduction-to-the-aws-cli/).

Before continuing, ensure that you can comfortably run this command:

```
aws cloudformation list-stacks
```

Throughout the series we'll use the AWS CLI to verify and deploy our CloudFormation templates, check the progress and output of our stack, delete the stack, and wait for transitions in its state so we can easily chain commands.

If you're not sure what a stack is, perhaps this [AWS CloudFormation Concepts article](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-whatis-concepts.html) (which I found by Googling "CloudFormation stack") can help explain. It covers other basic concepts too, which may come in handy.

I won't assume any knowledge or experience in the AWS API, other than what I just mentioned: that you've got it working.

### Writing CloudFormation Templates

Although the final version of a CloudFormation template must be JSON, that doesn't necessarily mean that JSON is what you need to actually work with. Since the notation primarily acts as a form of data storage, as opposed to a programming language, it lacks basic features like comments and variables which become essential as your templates begin to grow.

As many developers before us have faced this problem, existing solutions like domain-specific languages (or DSLs) exist (including [cfndsl](https://github.com/stevenjack/cfndsl), which even has a [repository filled with examples](https://github.com/neillturner/cfndsl_examples)), and those are great. It should be easy to look around and find other options if you're so willing.

However it's also pretty easy to do your own thing here too, as I chose to do with Node.js:

```
const instanceType = "t2.nano";
const numInstances = 5;

let template = {
  ...
};

for(let i = 1; i <= numInstances; ++i) {
  template.Resources["EC2Instance" + i] = {
    ...
  };
}

console.log(JSON.stringify(template));
```

Whichever method you choose is fine, however I strongly recommend using *something* other than plain JSON.

Node.js will be used throughout the series as it presents nothing new to learn – the JavaScript used will be simple and easy enough to follow even with just a little programming experience. In the snippet above all I'm doing is building up an object, and outputting it as JSON. I'd run that script via `node my-template.js > my-template.json` and then feed that output file into the AWS CLI.

Pick your poison before continuing – the remainder of the guide will assume you've got your method of compiling to JSON sorted out.

### Validating and Attempting Deployments With the CLI

The AWS CLI has great help utilities. If you type `aws help`, you'll find a big list of all of the available subcommands. In particular, we'll find `cloudformation` in that list. [This article](https://www.thegeekstuff.com/2010/02/unix-less-command-10-tips-for-effective-navigation) can help get you navigating and searching more efficiently in `less`, which is the command line tool almost always used to explore help and `man` pages.

You can then continue and type `aws cloudformation help` to find the options in that subcommand, where you'll find the `create-stack` subcommand.

The chain goes on. Typing `aws cloudformation create-stack help` will show you all of the details regarding executing that command. Now we're looking at the specifics: what we need is `--stack-name` and `--template-body` (because `--template-url` only works with S3). The example at the bottom of that help page even shows us how to specify a template file instead of providing the JSON verbatim into the command:

```
aws cloudformation create-stack --stack-name myteststack --template-body file:////home//local//test//sampletemplate.json
```

Note: I'm not sure about all the double slashes in their example. In my experience providing the normal path to the file, prefixed with `file://`, works just fine.

In the interests of starting from scratch, however, the most basic way of attempting a CloudFormation deployment is in fact by providing a JSON structure directly to the CLI. Run this command:

```
aws cloudformation create-stack \
  --stack-name test \
  --template-body '{}'
```

Unfortunately that's too basic to actually work, but at least we've got the command running.

```
An error occurred (ValidationError) when calling the CreateStack operation: Template format error: At least one Resources member must be defined.
```

The error described above could've been caught before attempting to create the stack, as it's described as a `ValidationError`. If we take a step back and look at `aws cloudformation help` again you'll find the `validate-template` subcommand, which can be used prior to attempting to create a stack to assist in debugging, if desired.

`aws cloudformation validate-template help` reveals that it similarly requires a `--template-body`, but not a `--stack-name`, to be specified, so executing the following would give the same output as above:

```
aws cloudformation validate-template \
  --template-body '{}'
```

The difference between the commands becomes apparent when the template is successfully validated: `validate-template` will simply report any details discovered in that template and exit, whereas `create-stack` will, intuitively, continue to actually create the stack in AWS.

Moving on, let's no longer provide the JSON directly to the command – it's not a good idea moving forward. I'll jump straight into Node.js here and output a basic template – go ahead and use your preferred compilation strategy instead. I'll call the following file `test-template.js`:

```
let t = {};

console.log(t);
```

Now I can run that file and execute CloudFormation commands against it:

```
node test-template.js > /tmp/test-template.json &amp;&amp; \
aws cloudformation validate-template \
  --template-body file:///tmp/test-template.json
```

If all goes well, you should yet again see the same output as above, however this time we're working with a set of copy-pasteable commands. We can simply edit our template and paste those commands from here on.

#### Personal Recommendations

This may seem counter-intuitive, but if just starting out with the AWS CLI I recommend *religiously avoiding* copy-pasting or pressing the up button (even though I just hinted at the opposite) when repeating CLI commands. Instead, I manually type each command for the first day or so, as I find that really helps me learn its features, structure, and how to use it. It's slower, of course, but it'll pay off.

I output the compiled JSON to a non-obvious location: `/tmp/test-template.json`. I did that because I don't actually care about that file -except for when executing the `aws cloudformation` commands following its compilation. It's the `.js` file that I want to commit to version control and work with in general. I consider the `/tmp` directory as a place that I can dump things without worrying about – [it'll be cleared eventually](https://askubuntu.com/questions/20783/how-is-the-tmp-directory-cleaned-up), so I can just set and forget. Feel free to take this practice onboard or leave it behind as you wish. It's but a matter of preference. If you do use it, however, just be careful not to write to a location that may be used by some other process – try and pick a unique name.

I'm also using `&&` between the chained commands as if one fails there's no use in trying to execute those which follow it.

When you find the set of commands you're happy with, it's worth adding them as a comment somewhere in your template file, in whatever way works with your compiler:

    /* Use me like this:

    ```
    node test-template.js > /tmp/test-template.json &amp;&amp; \
    aws cloudformation validate-template \
      --template-body file:///tmp/test-template.json
    ```
    */

    let t = {};

    console.log(t);

Now even if you return to this template half a year after having last touched it, you'll still know how you went about using it. Keep this up to date and you'll have a self-contained, instructional, maintainable CloudFormation template – now you're in business!

In part 2 (which is coming soon), we'll stop working with an empty template and actually bring some infrastructure up. Looking forward to seeing you there. Also, feel free to email me at [mail@bilalakil.me](maito:mail@bilalakil.me) if you have any questions or comments at all.


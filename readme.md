# htmlpack 

> Rethink HTML

## Install

```
$ npm install -g htmlpack
```

## Why

Turn this:

```html
<style src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/css/bootstrap.min.css"></style>
<style>
  body {
    h1 {
      margin: 0;
    }
  }
</style>
<template>
  <div class="app">{{ time }}</div>
</template>

<script src="https://cdn.css.net/libs/vue/1.0.10/vue.min.js"></script>
<script src="./hey"></script>
<script>
  new Vue({
    el: '#app',
    data () {
      return {
        time: new Date()
      }
    },
    ready () {
      this.update()
    },
    methods: {
      update () {
        setTimeout(() => {
          this.time = new Date()
          this.update()
        }, 1000)
      }
    }
  })
</script>
```

Into this:

```html
<html>
  <head>
    <title>htmlpack</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.0.0-alpha/css/bootstrap.min.css">
    <style>
      body h1 {
        margin: 0;
      }
    </style>
  </head>
  <body>
    <div class="app">{{ time }}</div>
    <script src="https://cdn.css.net/libs/vue/1.0.10/vue.min.js"></script>
    <script>
      console.log('hey')
    </script>
    <script>
      'use strict';

      new Vue({
        el: '#app',
        data: function data() {
          return {
            time: new Date()
          };
        },
        ready: function ready() {
          this.update();
        },

        methods: {
          update: function update() {
            var _this = this;

            setTimeout(function () {
              _this.time = new Date();
              _this.update();
            }, 1000);
          }
        }
      });
    </script>
  </body>
</html>
```

## Usage

**htmlpack.config.js**

```javascript
// default config
export default {
  entry: 'entry.html',
  dest: 'index.html'
  plugins: {
    style: [ customTransfomer() ],
    script: [...],
    head: [...],
    template: [...]
  }
}
```

## License

MIT © [EGOIST](https://github.com/egoist)

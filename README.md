# Web Subtitles Editor

[Open editor here](https://rokyed.github.io/web-subtitles-editor/)

This is a tool to create and modify subtitles for videos/movies. The tool requires you to have the video/movie downloaded. There's no server for this tool. The work can be saved locally in json format or exported in subtitle format. In case of something where you close the tab, the work should technically be autosaved in local storage of the browser.

You do need to load the video every time you come to the app.

#### User manual:

```
Alt+Shift+H: Opens the help prompt, containing this info.
Ctrl+Z: Undo
Ctrl+Left Arrow: seeking left
Ctrl+Right Arrow: seeking right
Ctrl+Shift+Left Arrow: seeking left fast
Ctrl+Shift+Right Arrow: seeking right fast
Alt+D: Set video time to selected subtitle start
Alt+F: Set video time to selected subtitle end
Alt+Z: Set start of subtitle to current video time
Alt+X: Set end of subtitle to current video time
Alt+C: Create new subtitle
Alt+N: Set start time of future subtitle
Alt+M: Create new subtitle with start time from Alt+N and current time.
Alt+W: Set current time as text.
```


#### Why vanila javascript

It's fun, why not, nowadays browsers have so many builtin APIs and tools, I believe we don't need to always rely on modules that just create layers upon layers of abstraction.

The project is small enough and the scope is conscise enough that there's no need for an expanded codebase, with more abstraction.

#### Contributing

Just make changes and open PRs, I'm open to ideas.

![in editor screenshot](https://github.com/rokyed/web-subtitles-editor/blob/master/editor.png)

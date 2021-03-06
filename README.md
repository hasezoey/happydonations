I added some options in so some stuff can be tweaked.
Basically, it's just:
 - The size and position of the container
 - The update rate (in seconds) that it grabs your goal info from extra-life
 - The title's text appearance and position
 - The stats (money) text appearance and position

All the options are... optional. So this:
https://klutch.github.io/happydonations/

is the same as this: <br/>
```
https://klutch.github.io/happydonations/
?participantId=247547
&containerWidth=1280
&containerTop=0
&updateRate=10
&titleText=FUNDRAISING%20GOAL
&titleSize=60
&titleLetterSpacing=8
&titleTop=-10
&titleLeft=80
&titleColor=ffe9a8
&titleOutlineColor=000000
&titleOutlineWidth=1.5
&statsSize=60
&statsLetterSpacing=8
&statsTop=180
&statsColor=bdef64
&statsOutlineColor=000000
&statsOutlineWidth=1.5
&sign=$
```

All the values in the example above are the default values, so use any of those
as a starting point for tweaking.

For weekly or other custom goals, just set the `donationsSince` date with the format
`YYYY-MM-DD`, and an end goal in `donationGoal`. Custom goals don't work without both
a `donationsSince` and `donationGoal` parameter.
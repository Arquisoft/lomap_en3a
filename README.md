[![Actions Status](https://github.com/arquisoft/lomap_en3a/workflows/CI%20for%20LOMAP_EN3A/badge.svg)](https://github.com/arquisoft/lomap_en3a/actions)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_lomap_en3a&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Arquisoft_lomap_en3a)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=Arquisoft_lomap_en3a&metric=coverage)](https://sonarcloud.io/summary/new_code?id=Arquisoft_lomap_en3a)

<p align="center">
<img src="/docs/images/LoMap_logo.ico" alt="LoMap logo" height="200">
</p>

# :earth_africa: LoMap :earth_africa:

This project was created with the objective of offering an easy way of look for places, register 
and share new ones with everyone, family, friends or only with you. The user will be able to 
publish comments, puntuations and many more things. But, which is the main difference among 
other applications? **Every place, comment or piece of data is stored in your own POD!** All 
the 
information is managed entirely by its respectivly owner. **We only store the minimal information 
of things with public visibility.**

We encourage you to contribute to this project based on the <a href="https://solidproject.org/">SOLID project</a> which is directed by 
<u>Tim Berners-Lee</u>.

## :wrench: How to contribute :computer:
If you are interested in contribute to our repository you can start with any opened issue. We 
recommend you to start with the ones labeled as [good first issue](https://github.com/Arquisoft/lomap_en3a/labels/good%20first%20issue). In case there is no one, you can talk 
with us through the [General](https://github.com/Arquisoft/lomap_en3a/discussions/categories/general) category in [Discussions](https://github.com/Arquisoft/lomap_en3a/discussions). However, we have some no written rules 
for having more or less and standardize workflow.

### :straight_ruler: No written rules :pencil2:
Once you have read and understood our purpose and what has been done until the moment. You 
should follow always in the same order the following steps, in order to be everyone organised 
and not lost:
1. Comment in an open issue or discussion what you would like to do about the topic is being 
   treated there and mentioning any of the [contributors](#contributors).
2. Once your proposal is accepted, you can start coding **but always creating a new 
   branch**, unless you have talked with the developer of an already created branch, and he 
   had given you the permission of using it. If you have to create an issue, do not forget to 
   link them to the project, setting its status, size, and dates, apart from linking them to 
   milestones, the branches related to it and tags **(very important)**.
3. :rage:**Always keep your work updated in the repository, do not wait to "upload 
   later"**:rage:. Every 
   change is important. Thus, no one will program something already done by another.
4. Once you consider the featured is finished you can create a pull request and merge it into 
   Develop. **You must wait until has been approved by at least three contributors**
5. Merge the pull request and check whether the application still works with your code.
6. :arrows_counterclockwise: Repeat! :arrows_counterclockwise:

For any doubt don't hesitate in asking us :smile:

## :bowtie: Contributors
This project is being maintained by:
 - [Iván Menéndez Mosegui](https://github.com/uo282892)
 - [Pelayo Reguera García](https://github.com/Pelayo-Reguera)
 - [Guillermo Dylan Carvajal Aza](https://github.com/UO283069)
 - [Carlos Triana Fernández](https://github.com/UO283428)
 - [David Martínez Castañón](https://github.com/Davidmc07)

## :link: Application links
 - FINAL (PRESENTED) APPLICATION: https://lomapen3a.cloudns.ph
 - Github Pages version (older version, just for backup): https://davidmc07.github.io/lomap_en3a
 
 ## :rotating_light: Important information for usage :rotating_light:
 The public map does not load the first time because it uses the restapi to load the public places, and the browser does not allow the request because it does not trust the URL. The way to go is to open the browser console and locate the following message, in which we click the URL.
 
 ![Captura de pantalla 2023-05-08 002509](https://user-images.githubusercontent.com/98897888/236705410-a64fef65-d5d2-4c55-886d-b13485b029f3.png)
 
 Then, we click on the button of advanced options and select the option "continue to 52.172.254.115 (non-safe)" (english) or "Continuar a 52.172.254.115 (no seguro)" (spanish).
 
 ![Captura de pantalla 2023-05-08 002952](https://user-images.githubusercontent.com/98897888/236705680-b1f96212-e143-4242-b376-5844015ba6e0.png)

Once we do that, we close the window, we go back to the app and we reload it. Now, we should have the public map available, and the browser trusts the previous URL from now on.

![Captura de pantalla 2023-05-08 003727](https://user-images.githubusercontent.com/98897888/236705945-3fcd5784-f608-4160-a1c3-093e641ef605.png)


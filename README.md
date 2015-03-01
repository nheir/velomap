## VéloMap

VéloMap est une application Android dédiée aux utilisateurs des vélos libres services de Lyon et Bordeaux.

Cette application a été motivée par l'abscence d'application Vélov (Lyon) fonctionnant sans l'api de Google. 

Le code est basé sur celui de l'appli web [velimonde](https://github.com/gapato/velimonde).

### État et idées à réaliser ou non

- [x] Avec l'ajout des VCUB de Bordeaux, il faut récupérer les données sous format XML ce qui ne peut pas se faire en javascript. Donc la récupération des données se fait par l'application et non plus par le code javascript de la webview.
- [ ] Compacter les codes redondants javascript pour une intégration plus facile d'autres villes.
- [ ] Stations préférées et/ou liste des stations ?

### Utilisation

Avant de compiler cette application, vous devez indiquer les clés API qui vous permettront d'utiliser les divers sources de données dans le fichier [apikeys.sampl.xml](/app/src/main/res/values/apikeys.sample.xml)

Une fois dans VéloMap, vous pouvez zoomer, déplacer la carte, mettre à jour les données (via le 3e bouton) et voir le nombre de vélos et de places disponibles en appuyant sur une station. Appuyer sur le bouton menu pour changer de ville.

### Licence

Cette application est sous license [WTFPL](http://www.wtfpl.net/txt/copying/)

### Ressources

* [LeafletJS](http://leafletjs.com/)
* [jQuery](http://jquery.com/)

### Données

* [JCDecaux](https://developer.jcdecaux.com/) sous [« Licence Ouverte / Open Licence »](http://www.etalab.gouv.fr/licence-ouverte-open-licence)
* La Communauté Urbaine de Bordeaux [Portail OpenData](http://data.bordeaux-metropole.fr) également sous [« Licence Ouverte / Open Licence »](http://www.etalab.gouv.fr/licence-ouverte-open-licence)


const Discord = require("discord.js");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const express = require('express')
const app = express();

const adapter = new FileSync("database.json");
const adapter2 = new FileSync("events_data.json");
const adapter3 = new FileSync("equips_data.json");
const db = low(adapter);
const db2 = low(adapter2);
const db3 = low(adapter3);

db.defaults({ persos: []})
    .write();

db2.defaults({ events: []})
    .write();


db3.defaults({ equips: []})
    .write();
        
//HEROKU
app.set('port',(process.env.PORT || 5000));    
app.listen(app.get('port'), function(){
    console.log("Bot en fonctionnement sur le port"+ app.get('port'));
});

var bot = new Discord.Client();
var prefix = ("!");

bot.on("ready", () => {
    bot.user.setPresence({ game: { name: 'Sword Art Online : Memory Defrag', type: 0}});
    console.log("Bot Ready !");
});



bot.login("NTI0MjY2MTIzODk4NzgxNzA0.Dvlrog.4JflpYwnH08ScOK4e1Ipg09Iy-w");

bot.on("message", message => {
    if (!message.content.startsWith(prefix)) return;
    var args = message.content.substring(prefix.length).split(" ");

    switch (args[0].toLowerCase()){
        case "ping":
            message.reply("pong");
        break;

        case "help":
            var help_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var cmd = "   - !help          : Affiche les commandes du bot !";
            help_embed.addField("Commandes du bot !", cmd );
            var liste = "";
            liste = liste + "   - !maliste : Affiche la liste de mes personnages \n";
            liste = liste + "   - !liste6 : Affiche la liste des personnages 6* de base \n";
            liste = liste + "   - !liste5_6 : Affiche la liste des personnages 5* pouvant monter 6* \n";
            liste = liste + "   - !liste5_6_e : Affiche la liste des personnages 5* pouvant monter 6* récupérable en événements";
            help_embed.addField("Commandes des listes !", liste)
            var perso = "";
            perso = perso + " /!\\ Les persos 5* montent tous 6* dans la liste \n";
            perso = perso + "   - !perso6 X : Affiche le perso 6* numéro X \n";
            perso = perso + "   - !perso5_6 X : Affiche le perso 5* numéro X \n";
            perso = perso + "   - !perso5_6e X : Affiche le perso 5* d'evenement numéro X \n";
            help_embed.addField("Commandes de sélection de perso !", perso)
            var mydata = "";
            mydata = mydata + " /!\\ Les persos seront rajoutés à votre équipe \n";
            mydata = mydata + " /!\\ Pense à regarder la liste des persos pour ne pas te tromper ! \n";
            mydata = mydata + "   - !add6 X : Ajoute le perso 6* numéro X \n";
            mydata = mydata + "   - !add5_6 X : Ajoute le perso 5* numéro X \n";
            mydata = mydata + "   - !add5_6e X : Ajoute le perso 5* d'evenement numéro X \n";
            help_embed.addField("Commandes pour l'ajout de perso !", mydata)
            var event = "";
            event = event + "   - !events : Donne la liste des evenements en cours \n";
            event = event + "   - !events X : Donne des détails sur l'evenement X \n";
            help_embed.addField("Commandes pour les events !", event)
            message.channel.send(help_embed);
        break;

        case "liste6":
            var persosnumber = db.get('collection_6').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var personnages = "";
            var i = 0;
            list_embed.addField("Les personnages 6* :","Ces personnages sont des 6* de tirages");
            while (i < persosnumber){
                var id = db.get("collection_6["+i+"].id").toString().value();
                var nom = db.get("collection_6["+i+"].char_name").toString().value();
                var title = db.get("collection_6["+i+"].char_title").toString().value();
                var type = db.get("collection_6["+i+"].char_type").toString().value();
                var weap = db.get("collection_6["+i+"].char_weapon").toString().value();
                personnages = personnages + id + " : " +nom + " ["+ title + "] " + weap +" "+ type +"\n";
                i = parseInt(i+1);
                if( i%10 === 0 ){
                    list_embed.addField("---", personnages);
                    personnages = "";
                }
            }
            list_embed.addField("---", personnages);
            message.channel.send(list_embed);
        break;

        case "liste5_6":
            var persosnumber = db.get('collection_5_6_scouts').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var personnages = "";
            var i = 0;
            list_embed.addField("Les personnages 5* :","Ces personnages sont des 5* de tirages pouvant monter 6*");
            while (i < persosnumber){
                var id = db.get("collection_5_6_scouts["+i+"].id").toString().value();
                var nom = db.get("collection_5_6_scouts["+i+"].char_name").toString().value();
                var title = db.get("collection_5_6_scouts["+i+"].char_title").toString().value();
                var type = db.get("collection_5_6_scouts["+i+"].char_type").toString().value();
                var weap = db.get("collection_5_6_scouts["+i+"].char_weapon").toString().value();
                personnages = personnages + id + " : " +nom + " ["+ title + "] " + weap +" "+ type +"\n";
                i = parseInt(i+1);
                if( i%10 === 0 ){
                    list_embed.addField("---", personnages);
                    personnages = "";
                }
            }
            list_embed.addField("---", personnages);
            message.channel.send(list_embed);
        break;

        case "liste5_6_e":
            var persosnumber = db.get('collection_5_6_events').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var personnages = "";
            var i = 0;
            list_embed.addField("Les personnages 5* :","Ces personnages sont des 5* de tirages pouvant monter 6*");
            while (i < persosnumber){
                var id = db.get("collection_5_6_events["+i+"].id").toString().value();
                var nom = db.get("collection_5_6_events["+i+"].char_name").toString().value();
                var title = db.get("collection_5_6_events["+i+"].char_title").toString().value();
                var type = db.get("collection_5_6_events["+i+"].char_type").toString().value();
                var weap = db.get("collection_5_6_events["+i+"].char_weapon").toString().value();
                personnages = personnages + id + " : " +nom + " ["+ title + "] " + weap +" "+ type +"\n";
                i = parseInt(i+1);
                if( i%10 === 0 ){
                    list_embed.addField("---", personnages);
                    personnages = "";
                }
            }
            list_embed.addField("---", personnages);
            message.channel.send(list_embed);
        break;

        case "perso6":
            var name = message.content.substr(8);
            var persosnumber = db.get('collection_6').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var i = 0;
            while (i < persosnumber){
                var id = db.get("collection_6["+i+"].id").toString().value();
                var nom = db.get("collection_6["+i+"].char_name").toString().value();
                var title = db.get("collection_6["+i+"].char_title").toString().value();
                var type = db.get("collection_6["+i+"].char_type").toString().value();
                var weap = db.get("collection_6["+i+"].char_weapon").toString().value();
                var lien = db.get("collection_6["+i+"].url").toString().value();
                if (id === name){
                    list_embed.addField(nom + " ["+ title + "] " , weap + " - " + type);
                    list_embed.setThumbnail(url = lien);
                }
                i = parseInt(i+1);
            }
            message.channel.send(list_embed);
        break;

        case "perso5_6":
            var name = message.content.substr(10);
            var persosnumber = db.get('collection_5_6_scouts').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var i = 0;
            while (i < persosnumber){
                var id = db.get("collection_5_6_scouts["+i+"].id").toString().value();
                var nom = db.get("collection_5_6_scouts["+i+"].char_name").toString().value();
                var title = db.get("collection_5_6_scouts["+i+"].char_title").toString().value();
                var type = db.get("collection_5_6_scouts["+i+"].char_type").toString().value();
                var weap = db.get("collection_5_6_scouts["+i+"].char_weapon").toString().value();
                var lien = db.get("collection_5_6_scouts["+i+"].url").toString().value();
                if (id === name){
                    list_embed.addField(nom + " ["+ title + "] " , weap + " - " + type);
                    list_embed.setThumbnail(url = lien);
                }
                i = parseInt(i+1);
            }
            message.channel.send(list_embed);
        break;

        case "perso5_6e":
            var name = message.content.substr(11);
            var persosnumber = db.get('collection_5_6_events').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var i = 0;
            while (i < persosnumber){
                var id = db.get("collection_5_6_events["+i+"].id").toString().value();
                var nom = db.get("collection_5_6_events["+i+"].char_name").toString().value();
                var title = db.get("collection_5_6_events["+i+"].char_title").toString().value();
                var type = db.get("collection_5_6_events["+i+"].char_type").toString().value();
                var weap = db.get("collection_5_6_events["+i+"].char_weapon").toString().value();
                var lien = db.get("collection_5_6_events["+i+"].url").toString().value();
                if (id === name){
                    list_embed.addField(nom + " ["+ title + "] " , weap + " - " + type);
                    list_embed.setThumbnail(url = lien);
                }
                i = parseInt(i+1);
            }
            message.channel.send(list_embed);
        break;
        
        case "add6":
            var name = message.content.substr(6);
            var props = message.author.id;
            var number = parseInt(db.get("persos").map("id").value().length +1);

            message.reply("Ajout du personnage a votre compte");

            db.get("persos")
            .push({ id: number, char_id: name, categ: "6", char_props: props})
            .write()
        break;
        
        case "add5_6":
            var name = message.content.substr(8);
            var props = message.author.id;
            var number = parseInt(db.get("persos").map("id").value().length +1);

            message.reply("Ajout du personnage a votre compte");

            db.get("persos")
            .push({ id: number, char_id: name, categ: "5_6_scouts", char_props: props})
            .write()
        break;
        
        case "add5_6e":
            var name = message.content.substr(9);
            var props = message.author.id;
            var number = parseInt(db.get("persos").map("id").value().length +1);

            message.reply("Ajout du personnage a votre compte");

            db.get("persos")
                .push({ id: number, char_id: name, categ: "5_6_events", char_props: props})
                .write()
        break;

        case "maliste":
            var persosnumber = db.get('persos').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
            var personnages = "";
            var i = 0;
            while (i < persosnumber){
                var id = db.get("persos["+i+"].id").toString().value();
                var char_id = parseInt(db.get("persos["+i+"].char_id").toString().value() -1);
                var props = db.get("persos["+i+"].char_props").toString().value();
                var categ = db.get("persos["+i+"].categ").toString().value();
                if (props === message.author.id){
                    var nom = db.get("collection_"+categ+"["+char_id+"].char_name").toString().value();
                    var title = db.get("collection_"+categ+"["+char_id+"].char_title").toString().value();
                    var type = db.get("collection_"+categ+"["+char_id+"].char_type").toString().value();
                    var weap = db.get("collection_"+categ+"["+char_id+"].char_weapon").toString().value();
                    personnages = personnages + id + " : " + nom + "[" + title + "] " + emojiID(type) +" "+ emojiID(weap) + "\n";
                }
                i = parseInt(i+1);
            }
            list_embed.addField("Vos personnages :", personnages);
            message.channel.send(list_embed);
        break;

        case "events":
            var list_embed = new Discord.RichEmbed()
            var name = message.content.substr(8);
            var eventsnumber = db2.get('events_list').map('id').value().length;
            if (name === ""){
                var event = "";
                var i = 0;
                while (i < eventsnumber){
                    var no = db2.get("events_list["+i+"].id").toString().value();
                    var titre = db2.get("events_list["+i+"].name").toString().value();
                    var date = db2.get("events_list["+i+"].date").toString().value();
                    var fini = db2.get("events_list["+i+"].fini").toString().value();
                    if (fini === "Non"){
                        event = event + "  - n°"+no +"  "+date+"   "+titre+"\n";
                    }
                    i = parseInt(i+1);
                }
                list_embed.addField("Les events en cours :", event);
                message.channel.send(list_embed);
            }else{
                name = parseInt(name -1);
                var titre = db2.get("events["+name+"].name").toString().value();
                var texte = db2.get("events["+name+"].texte").toString().value();
                var reward = db2.get("events["+name+"].rewards").toString().value();
                var supp = db2.get("events["+name+"].supp").toString().value();
                var lien = db2.get("events["+name+"].url").toString().value();
                list_embed.setImage(url = lien);
                list_embed.addField(titre, texte);
                list_embed.addField("Récompenses", reward);
                list_embed.addField("Infos supplémentaires", supp);
                message.channel.send(list_embed);
            }
        break;

        case "equips":
            var list_embed = new Discord.RichEmbed()
            var name = message.content.substr(8);
            var equipsnumber = db3.get('equips').map('id').value().length;
            if (name === ""){
                var equip = "";
                var i = 0;
                while (i < equipsnumber){
                    var no = db3.get("equips["+i+"].id").toString().value();
                    var nom = db3.get("equips["+i+"].name").toString().value();
                    var rar = db3.get("equips["+i+"].rarity").toString().value();
                    var type = db3.get("equips["+i+"].type").toString().value();
                    var elem = db3.get("equips["+i+"].element").toString().value();
                    equip = equip + "  - n°"+no +" "+nom+" "+rar+" "+emojiID(type)+emojiID(elem) +"\n";
                    i = parseInt(i+1);
                }
                console.log(equip+" "+equipsnumber)
                list_embed.addField("Les equipements disponibles :", equip);
                message.channel.send(list_embed);
            }else{
                name = parseInt(name -1);
                var nom = db3.get("equips["+name+"].name").toString().value();
                var type = db3.get("equips["+name+"].type").toString().value();
                var element = db3.get("equips["+name+"].element").toString().value();
                var rar = db3.get("equips["+name+"].rar").toString().value();
                var hp = db3.get("equips["+name+"].hp").toString().value();
                var mp = db3.get("equips["+name+"].mp").toString().value();
                var atk = db3.get("equips["+name+"].at").toString().value();
                var def = db3.get("equips["+name+"].de").toString().value();
                var crit = db3.get("equips["+name+"].cr").toString().value();
                var bs1 = db3.get("equips["+name+"].skill1").toString().value();
                var bs2 = db3.get("equips["+name+"].skill2").toString().value();
                var bs3 = db3.get("equips["+name+"].skill3").toString().value();
                var lieu = db3.get("equips["+name+"].finder").toString().value();
                var lien = db3.get("equips["+name+"].url").toString().value();
                list_embed.setThumbnail(url = lien);
                var texte = emojiID(type) + emojiID(element) +"\n RAR :"+rar+"\n"+"HP   :" +hp+"\n"+"MP   :" +mp+"\n"+"ATK  :" +atk+"\n"+"DEF  :" +def+"\n"+"CRIT :" +crit+"\n"+"Battle Skill 1" +bs1+"\n"+"Battle Skill 2" +bs2+"\n"+"Battle Skill 3" +bs3+"\n";
                list_embed.addField(nom, texte);
                list_embed.addField("Où le trouver ?", lieu);
                message.channel.send(list_embed);
            }
        break;    
    }

});
function emojiID(emoji){
    switch (emoji){
        case "Fire":
            return "<:Fire:524693985210400768>";
        break;
        case "Water":
            return "<:Water:524694016655097872>";
        break;
        case "Earth":
            return "<:Earth:524693974426976286>";
        break;
        case "Wind":
            return "<:Wind:524694025874309120>";
        break;
        case "Light":
            return "<:Light:524693995553685525>";
        break;
        case "Dark":
            return "<:Dark:524693945788268574>";
        break;
        case "No elements":
            return "<:NoElements:524694005452242975>";
        break;
        case "Bow":
            return "<:Bow:524983733959393290>";
        break;
        case "Dagger":
            return "<:Dagger:524983744658931713>";
        break;
        case "Dual Swords":
            return "<:DualSwords:524983754452631562>";
        break;
        case "Gun":
            return "<:Gun:524983766456991764>";
        break;
        case "Lance":
            return "<:Lance:524983775860490250>";
        break;
        case "Mace":
            return "<:Mace:524983785742401537>";
        break;
        case "Rapier":
            return "<:Rapier:524983807091146764>";
        break;
        case "Rifle":
            return "<:Rifle:524983817656860672>";
        break;
        case "ShieldBlade":
            return "<:ShieldBlade:524983826339069952>";
        break;
        case "Staff":
            return "<:Staff:524983834153058314>";
        break;
        case "Sword":
            return "<:Sword:524983851043389470>";
        break;
        case "Armor":
            return "<:Armure:525250701471907842>";
        break;
        case "Accessory":
            return "<:Accessoire:525250709952790529>";
        break;
    }
    return;
}
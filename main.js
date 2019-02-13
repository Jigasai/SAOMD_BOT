const Discord = require("discord.js");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const express = require('express')
const app = express();

const adapter = new FileSync("data.json");
const db = low(adapter);

db.defaults({ persos: []})
    .write();

var bot = new Discord.Client();
var prefix = ("!");
var valPts = 0;
var lucPts = 0;
var guiPts = 0;
var kylPts = 0;

bot.on("ready", () => {
    bot.user.setPresence({ game: { name: 'Mdoula !', type: 0}});
    console.log("Bot Ready !");
});



bot.login(process.env.BOT_TOKEN);

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
            cmd = cmd + "   - !match vie 1er 2eme 3eme 4eme Nom de la map: Ajoute une partie dans les scores \n";
            help_embed.addField("Commandes du bot !", cmd );
            message.channel.send(help_embed);
        break;

        case "match":
            var name = message.content.substr(7);
			var test = name.split(" ");
			var life  = test[0];
			var first  = test[1];
			var second = test[2];
			var third  = test[3];
			var fourth = test[4];
			var map  = name.substr(17);
			
            var idMatch = parseInt(db.get("persos").map("id").value().length +1);

            message.reply("Ajout des données du match faites !");

            db.get("Match")
            .push({ id: idMatch, vie: life, un: first, deux: second, trois: third, quatre: fourth, carte: map})
			.write()
			
			if(vie==5){
				db.get("HF")
				.push({ id: 1, proprio:getPlayer(first)})
				.write()
			}
        break;
		
		
        case "ScoreTotal":
            var name = message.content.substr(8);
            var matchnumber = db.get('Match').map('id').value().length;
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")
			
            var i = 1;
            while (i < matchnumber){
                var id = db.get("Match["+i+"].id").toString().value();
                var vie = db.get("Match["+i+"].vie").toString().value();
                var pre = db.get("Match["+i+"].un").toString().value();
				addPts(1,pre,vie);
                var deu = db.get("Match["+i+"].deux").toString().value();
				addPts(2,deu,0);
                var tro = db.get("Match["+i+"].trois").toString().value();
				addPts(3,tro,0);
                var qua = db.get("Match["+i+"].quatre").toString().value();
				addPts(4,qua,0);
                var map = db.get("Match["+i+"].carte").toString().value();
                
                i = parseInt(i+1);
            }
			var texte = "1er : "+getPremier("nom")+" "+getPremier("pts")+" pts";
			texte = texte + "2eme : "+getDeuxieme("nom")+" "+getDeuxieme("pts")+" pts";
			texte = texte + "3eme : "+getTroisieme("nom")+" "+getTroisieme("pts")+" pts";
			texte = texte + "4eme : "+getQuatrieme("nom")+" "+getQuatrieme("pts")+" pts";
			list_embed.addField("Les résultats :",texte);
            message.channel.send(list_embed);
        break;
        
        case "profile":
            var name = message.content.substr(9);
			var nom = getPlayer(name);
			
			var top1 = 0;
			var top2 = 0;
			var top3 = 0;
			var top4 = 0;
			var score = 0;
			var win = 0;
			var streak = 0;
			var bestStreak = 0;
			var nbVie = 0;
			var nbPerfect = 0;
			
            var list_embed = new Discord.RichEmbed()
            .setColor("#D9F200")		
			
            var matchnumber = db.get('Match').map('id').value().length;
            var i = 1;
            while (i < matchnumber){
                var id = db.get("Match["+i+"].id").toString().value();
                var vie = db.get("Match["+i+"].vie").toString().value();
                var pre = db.get("Match["+i+"].un").toString().value();
				if(pre==nom){
					win+=1;
					top1+=1;
					nbVie+= vie;
					score+= vie+10;
					streak+=1;
					if(vie==5)nbPerfect+=1;
				}
                var deu = db.get("Match["+i+"].deux").toString().value();
				if(deu==nom){
					top2+=1;
					if(streak>bestStreak)bestStreak=streak;
					streak = 0;
					score+=7;
				}
                var tro = db.get("Match["+i+"].trois").toString().value();
				if(tro==nom){
					top3+=1;
					if(streak>bestStreak)bestStreak=streak;
					streak = 0;
					score+=5;
				}
                var qua = db.get("Match["+i+"].quatre").toString().value();
				if(qua==nom){
					top4+=1;
					if(streak>bestStreak)bestStreak=streak;
					streak = 0;
					score+=3;
				}
                var map = db.get("Match["+i+"].carte").toString().value();
                
                i = parseInt(i+1);
            }
			//Calcul du %age avec win et matchnumber
			
            var txt = ""+name+"\n";
			txt = txt+"Score : "+score+"\n";
			txt = txt+"Victoires : "+win+"\n";
			txt = txt+"Best Win Streak : "+streak+"\n";
			txt = txt+"Vie restantes : "+nbVie+"\n";
			txt = txt+"\n";
			txt = txt+"Nombre de perfect : "+nbPerfect+"\n";
			txt = txt+"\n";
			txt = txt+"Résultats totaux :"+"\n";
			txt = txt+"TOP 1 : "+top1+"\n";
			txt = txt+"TOP 2 : "+top2+"\n";
			txt = txt+"TOP 3 : "+top3+"\n";
			txt = txt+"TOP 4 : "+top4+"\n";
			
            list_embed.addField("Page profil", txt);
            message.channel.send(list_embed);
        break;

    }

});
function emojiID(emoji){
    switch (emoji){
        case "Fire":
            return "<:Fire:524693985210400768>";
        break;
    }
    return;
}
function addPts(place,valeur,vie){
	var pt = vie;
	if(place==1)pt+=10;
	if(place==2)pt+=7;
	if(place==3)pt+=5;
	if(place==4)pt+=3;
	if(valeur=="V"){
		valPts += pt;
	}else if(valeur=="L"){
		lucPts += pt;
	}else if(valeur=="G"){
		guiPts += pt;
	}else if(valeur=="K"){
		kylPts += pt;
	}
}

function getPlayer(nom){
	if(nom=="Jaakuna"){
		return "V";
	}else if(nom=="V"){
		return "Jaakuna";
	}else if(nom=="Jigasai"){
		return "L";
	}else if(nom=="L"){
		return "Jigasai";
	}else if(nom=="Aikory"){
		return "G";
	}else if(nom=="G"){
		return "Aikory";
	}else if(nom=="Kurse"){
		return "K";
	}else if(nom=="K"){
		return "Kurse";
	}
}

function getPremier(data){
	var max = valPts;
	var nom = "Jaakuna";
	
	if(lucPts > max){
		max = lucPts;
		nom = "Jigasai";
	}
	if(guiPts > max){
		max = guiPts;
		nom = "Aikory";
	}
	if(kylPts > max){
		max = kylPts;
		nom = "Kurse";
	}
	if(data=="pts")return max;
	if(data=="nom")return nom;
}
function getDeuxieme(data){
	var max = getPremier("pts");
	var pts = 0;
	var nom = "";
	if(valPts > pts && valPts != max){
		pts = valPts;
		nom = "Jaakuna";
	}
	if(lucPts > pts && lucPts != max){
		pts = lucPts;
		nom = "Jigasai";
	}
	if(guiPts > max && guiPts != max){
		pts = guiPts;
		nom = "Aikory";
	}
	if(kylPts > max && kylPts != max){
		pts = kylPts;
		nom = "Kurse";
	}
	if(data=="pts")return pts;
	if(data=="nom")return nom;
}
function getTroisieme(data){
	var max = getPremier("pts");
	var max2 = getDeuxieme("pts");
	
	var pts = 0;
	var nom = "";
	if(valPts > pts && valPts != max && valPts != max2){
		pts = valPts;
		nom = "Jaakuna";
	}
	if(lucPts > pts && lucPts != max && lucPts != max2){
		pts = lucPts;
		nom = "Jigasai";
	}
	if(guiPts > max && guiPts != max && guiPts != max2){
		pts = guiPts;
		nom = "Aikory";
	}
	if(kylPts > max && kylPts != max && kylPts != max2){
		pts = kylPts;
		nom = "Kurse";
	}
	if(data=="pts")return pts;
	if(data=="nom")return nom;
}

function getQuatrieme(data){
	var max = getPremier("pts");
	var max2 = getDeuxieme("pts");
	var max3 = getToisieme("pts");
	
	var pts = 0;
	var nom = "";
	if(valPts > pts && valPts != max && valPts != max2 && valPts != max3){
		pts = valPts;
		nom = "Jaakuna";
	}
	if(lucPts > pts && lucPts != max && lucPts != max2 && lucPts != max3){
		pts = lucPts;
		nom = "Jigasai";
	}
	if(guiPts > max && guiPts != max && guiPts != max2 && guiPts != max3){
		pts = guiPts;
		nom = "Aikory";
	}
	if(kylPts > max && kylPts != max && kylPts != max2 && kylPts != max3){
		pts = kylPts;
		nom = "Kurse";
	}
	if(data=="pts")return pts;
	if(data=="nom")return nom;
}




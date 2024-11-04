const yaml = require('js-yaml');
const fs   = require('fs');
const path = require("path");

const markdownIt = require('markdown-it');


module.exports = {
    createProjetoObj : function (title, subtitle, group, image, link, description, tags, ){

        let projObj = {
            'title' : title,
            'subtitle' : subtitle,
            'group' : group,
            'image' : image,
            'link': link,
            'description': description,
            'repo' : '',
            'tags' : tags,
        
        }
    
        return projObj;
    
    },
    
    getAllProjectsInfo: function(){
        //TODO: O CAMINHO VAI TER DE SER MODIFICADO
        var markObj = new markdownIt();
        var retornoJSON = {};

        try{
            const dir = fs.opendirSync(path.resolve('../site_template/' , '_projects/'));
            let dirent
            while ((dirent = dir.readSync()) !== null) {
                let content = fs.readFileSync(path.resolve('../site_template/' , '_projects/'+dirent.name), 'utf8');
                let currentProj = markObj.parse(content);
                    //Titulo ; Subtitulo ; GRP
                    //console.log(currentProj);
                    
                let filter = currentProj.filter((elem) =>{
                if (elem.content != ''){
                    return elem.content;
                }
                    return false;
                })

                let tituloProj = filter[0].content.split("\n")[0].replace("title:", '');
                let subTituloProj = filter[0].content.split("\n")[1].replace("subtitle:", '');
                subTituloProj = subTituloProj.trim();
                tags = [];
                filter.forEach((elem) => {
                    if (elem.level === 3){ //Identificador que retorna as tags
                        tags.push(elem.content);
                    }
                })
                
                retornoJSON[Object.keys(retornoJSON).length] = {
                    'titulo': tituloProj,
                    'subtitulo': subTituloProj,
                    'tags': tags
                }

                
            }
            dir.closeSync()
            return retornoJSON;
        } catch(err){
            return null;
        }

        
        
    },

    addNewProject: function(projObj){
        const proj = this.createProjetoObj(projObj['proj_titulo'], 
            projObj['proj_subtitulo'], projObj['grupo_projeto'], projObj['filefoto'], projObj['link_projeto'],
            projObj['desc_projeto'], projObj['chip']
        );


        var bodyMarkdown = `---
title: ${proj['title']}
subtitle: ${proj['subtitle']}
image: ${proj['image']}
link: ${proj['link']}
description: ${proj['description']}

background_image: "/assets/images/fundos/fundoneutro.svg"
`;
        if(proj.tags.length != 0){
            bodyMarkdown = bodyMarkdown + `tags:`;
            proj.tags.forEach(function(elm){
                bodyMarkdown = bodyMarkdown + `\n   - `+elm;
            })
        }
    
        bodyMarkdown = bodyMarkdown + `\n---`;

        bodyMarkdown = bodyMarkdown + `\n${proj['description']}`
        
        proj['title'] = proj['title'].replace("-", '');
        proj['title'] = proj['title'].replace("/", '');
        //TODO: Modificar Caminho Depois
        let camProj = path.resolve('../site_template/' , '_projects/'+proj['title'].split(" ").join('')+'.md');
        fs.writeFileSync(camProj, bodyMarkdown, function (err) {
            if (err) return 400;
            return 200;
        });

        return 200;    
    
    },

    prepareImageMembro: function(flagTemImg, imgName){
        if (flagTemImg){
            //TODO : Modificar caminhos
            let camAntigo = path.resolve('./', 'uploads/'+imgName);
            var camNovo = path.resolve('../site_template/' , 'assets/images/membros/'+imgName);

            fs.rename(camAntigo, camNovo, (err)=>{
                if (err) throw err
                console.log('Movido');
            })

            return '/assets/images/membros/'+imgName;
        }

        return '';

    },

    prepareImagePath : function (flagTemImg, imgName, flagNoticia){
        if(flagTemImg){
            
            let camAntigo;
            let camNovo
            if(flagNoticia){
                camAntigo = 'C:/Users/User/Desktop/NCA-API/uploads/'+imgName;
                //TODO: MUDAR CAMINHOS
                camNovo = 'C:/Users/User/Documents/GitHub/site_template/assets/images/noticias/'+imgName;
            }else{
                camAntigo = path.resolve('./', 'uploads/'+imgName);
                camNovo = path.resolve('../site_template/' , 'assets/images/projetos/'+imgName);
            }
            
            
            fs.rename(camAntigo, camNovo, (err)=>{
                if (err){
                    //TODO: Deletar img de uploads
                }
                console.log('Movido');
            })
            
            
            if(flagNoticia){
                return '/assets/images/noticias/'+imgName;
            }

            return '/assets/images/projetos/'+imgName;
        }
    
        return '';
    
    }, 

    prepareMarkdownNoticia: function(titulo, imageDir, tags, description){
        var bodyMarkdown = `---
title: ${titulo}
image: ${imageDir}
`;
        if(tags.length != 0){
            bodyMarkdown = bodyMarkdown + `tags:`;
            tags.forEach(function(elm){
                bodyMarkdown = bodyMarkdown + `\n   - `+elm;
            })
        }
    
        bodyMarkdown = bodyMarkdown + `\n---`;

        bodyMarkdown = bodyMarkdown + `\n${description}`
    
        return bodyMarkdown;
    
    },

    saveNoticia: function(titulo, imageDir, tags, description){
        const nameNoticia = Date.now() + '-' + 'post';
    
        //TODO: MUDAR CAMINHOS 
        fs.writeFileSync('C:/Users/User/Documents/GitHub/site_template/_posts/'+nameNoticia+'.md', this.prepareMarkdownNoticia(titulo, imageDir, tags, description), function (err) {
            if (err) throw err;
            console.log('Saved!');
          });
        
    },

    saveMembro: function(nameMembro, descMembro, roleMembro, affiliationMembro, contatosObj, imgMembro){
        let camMembro = path.resolve('../site_template/' , '_members/'+nameMembro+'.md');
        fs.writeFileSync(camMembro, this.prepareMarkdownMembro(nameMembro, descMembro, roleMembro, affiliationMembro, contatosObj, imgMembro), function (err) {
            if (err) return 400;
            return 200;
        });

        return 200;
    },

    prepareMarkdownMembro: function(nameMembro, descMembro, roleMembro, affiliationMembro, contatosObj, imgMembro){
        for (let key in contatosObj){
            if (contatosObj[key] == ''){
                delete contatosObj[key];
            }
        }



        var bodyMarkdown = `---
name: ${nameMembro}
image: ${imgMembro}
description: ${descMembro}
role: ${roleMembro}
affiliation: ${affiliationMembro}
`;
        if(Object.keys(contatosObj).length > 0){
            
            for (let key in contatosObj){
                bodyMarkdown += `${key} : ${contatosObj[key]}\n`
            }
        }
    
        bodyMarkdown = bodyMarkdown + `---`;

        //bodyMarkdown = bodyMarkdown + `\n${description}`
    
        return bodyMarkdown;
    
    },




}




#include "createspinconfigscript.h"

#include "mainwindow.h"
#include <QFile>
#include <QTextStream>
#include <QString>
#include <QDebug>
#include <QDir>
void copyPath(QString src, QString dst);

CreateSpinConfigScript::CreateSpinConfigScript(MainWindow * object)
{
    data = object;
}


int CreateSpinConfigScript::buildSpinConfig(){
    if(data->getStringDescription().length() == 0) return 0;

    QString category, ext = data->basic_extension;
    QFile file(data->basic_catalog + data->separator + "conf_" + data->hash_cat + ".js");
    file.open(QIODevice::WriteOnly | QIODevice::Text);

    QTextStream stream_config(&file);
    stream_config << "if(aim==undefined){"
                  <<  " var aim = {};"
                 << "}\n";

    stream_config << "var " + data->hash_cat + " = { \n";
    stream_config << "path: '" + data->hash_cat + "', \n";
    stream_config << "uniq: '" + data->hash_cat + "', \n";


    QMap <QString, bool>::iterator cat;

    if (data->hash_name_status) {
        for (cat = data->category.begin(); cat != data->category.end(); cat ++) {
            category = cat.key();
            stream_config << category << ": { \n";

            int count = 0;
            int i = 0;
            if (category == "rotate") {
                 qDebug() << " it's rotate !   ";
                count += (data->size_category[category][0] + 1) * (data->size_category[category][1] + 1);
                count--;
            } else {
                count += data->size_category[category][0];
            }

            stream_config <<  "small:[";
            //qDebug() << category;

            for (i = 0; i <= count && data->category[category] == true; i++) {
                stream_config << "'" + data->hash_names_array[category + "_small"][i] + ext + "'";
                if(i <= count-1) stream_config << ",";
            }

            stream_config <<  " ], \n\n full:[";

            for (i = 0; i <= count && data->category[category] == true; i++) {
                stream_config << "'" + data->hash_names_array[category + "_full"][i] + ext + "'";
                if(i <= count-1)stream_config << ",";
            }

            stream_config <<  " ], \n\n animate:" + QString::number(data->animate_category_status[category + "_animate"]) + ", count:" << QString::number(data->size_category[category][0]) << "}, \n";
        }
    } else {
        for (cat = data->category.begin(); cat != data->category.end(); cat ++) {
            category = cat.key();
            stream_config << category << ": { \n";
            int count = 0;

            stream_config <<  "small:[";

            for (int h=0; h <= data->size_category[category][1] && data->category[cat.key()] == true; h++ ) {
                for(int w=0; w <= data->size_category[category][0]; w++){
                    stream_config << "'img_0_"+ QString::number(h) + "_" + QString::number(w) + ext + "'";

                    if(h != data->size_category[category][1] || w != data->size_category[category][0]){
                        stream_config << ",";
                    }

                    count++;
                }
            }

            stream_config <<  " ], \n\n full:[";
            for (int h=0; h <= data->size_category[category][1] && data->category[cat.key()] == true; h++ ) {
                for (int w=0; w <= data->size_category[category][0]; w++) {
                    stream_config << "'img_0_"+ QString::number(h) + "_" + QString::number(w) + ext + "'";

                    if (h != data->size_category[category][1] || w != data->size_category[category][0]) {
                        stream_config << ",";
                    }

                }
             }

            stream_config <<  " ], \n\n animate:" + QString::number(data->animate_category_status[category + "_animate"]) + ", count:" << QString::number(data->size_category[category][0]) << "}, \n";
        }
    }

    stream_config << " \n } \n";
    stream_config << "aim[" + data->hash_cat + ".uniq]=" + data->hash_cat << ";";
    file.close();


    //create spin description

    QFile file_description(data->basic_catalog + data->separator + "description.txt");
    file_description.open(QIODevice::WriteOnly | QIODevice::Text);
    QTextStream stream_desc(&file_description);
    stream_desc << data->getStringDescription();
    file.close();


    QString original = QDir::currentPath() + data->separator + "assets" + data->separator + "css";
    QString dest = data->basic_catalog + data->separator + "css";
    //qDebug() << dest << " ::: " << original;

    copyPath(original, dest);

    QFile in_index_file(QDir::currentPath() + data->separator + "assets" + data->separator +"index.html");
    in_index_file.open(QIODevice::Text|QIODevice::ReadOnly);
    QTextStream stream_index_in(&in_index_file);


    QFile out_index_file(data->basic_catalog + data->separator +"index.html");
    out_index_file.open(QIODevice::Text|QIODevice::WriteOnly);
    QTextStream stream_index_out(&out_index_file);

    stream_index_out << stream_index_in.readAll();
    in_index_file.close();
    //out_index_file.close();

    QString fileName = "";
    if(data->getPathToImage().length() > 0){
        QFile in_ico_file( data->getPathToImage() );
        in_ico_file.open(QIODevice::Text|QIODevice::ReadOnly);

        QFileInfo info(in_ico_file);
        QFile::copy( data->getPathToImage(), data->basic_catalog + data->separator + info.fileName());

        fileName = info.fileName();

        in_ico_file.close();
    }

    stream_index_out << "<a href=\"#\" style=\"position:relative;\" data-tag=\"" + data->hash_cat + "\" data-show=\"conf_" + data->hash_cat + ".js\">" +
            "<img src =\"" + fileName + "\" style=\""+
            "	margin: 0px;\n"+
            "	border: none;"+
            "	width:" + data->getSizeImage()[0] + "\px;"+
            "	height:" + data->getSizeImage()[1] + "px;\">"+
            "</img></a> \n\n";

    QString route;
    if(data->to == "server") route = data->getURL();
    stream_index_out << "<script type=\"text/javascript\"> var aim = {}; var core = new Init('" <<  route << "'); </script>";
    out_index_file.close();

    QFile core_file(QDir::currentPath() + data->separator + "assets" + data->separator + "core.js");
    core_file.open(QIODevice::Text|QIODevice::ReadOnly);
    QTextStream stream_core_data_file(&core_file);

    QFile core_dest(data->basic_catalog + data->separator +"core.js");
    core_dest.open(QIODevice::Text|QIODevice::WriteOnly);
    QTextStream stream_core_file_dest(&core_dest);
    stream_core_file_dest << stream_core_data_file.readAll();

    core_file.close();
    core_dest.close();
}


void copyPath(QString src, QString dst)
{
    QDir dir(src);
    if (! dir.exists()){
        qDebug() << "error";
        return;
    }

    foreach (QString d, dir.entryList(QDir::Dirs | QDir::NoDotAndDotDot)) {
        QString dst_path = dst + QDir::separator() + d;
        dir.mkpath(dst_path);
        copyPath(src + QDir::separator() + d, dst_path);
    }

    foreach (QString f, dir.entryList(QDir::Files)) {
        QFile::copy(src + QDir::separator() + f, dst + QDir::separator() + f);
    }
}

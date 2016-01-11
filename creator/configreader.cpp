#include "configreader.h"
#include <QXmlStreamReader>
#include <QXmlStreamWriter>
#include <QDebug>
#include <QFile>
#include <QTextStream>
#include <QString>
ConfigReader::ConfigReader()
{

}

bool ConfigReader::read(){
        QFile * file = new QFile("config.xml");
         if (!file->open(QIODevice::ReadOnly | QIODevice::Text))
        {
            qDebug() << "error";
        }

        QXmlStreamReader xml(file);

        while ( !xml.atEnd() && !xml.hasError() )
         {
            setConfigKeys(xml);
            xml.readNext();
        }
        return (data_config.count() == 0)? false:true;
}


void ConfigReader::saveConfig(){
    QFile * file = new QFile("config.xml");
    if ( !file->open(QIODevice::WriteOnly) ){
        qDebug() << "error";
    }

    QMap<QString, QString>::iterator config_iterator = data_config.begin();
    QXmlStreamWriter stream(file);
    stream.setAutoFormatting(true);
    stream.writeStartDocument();
    stream.writeStartElement("data");

    for(; config_iterator != data_config.end(); config_iterator++){
        //qDebug() << config_iterator.key();
        stream.writeTextElement(config_iterator.key(), config_iterator.value());
    }

    stream.writeEndElement();
    stream.writeEndDocument();
    file->close();
}


void ConfigReader::setConfigKeys(QXmlStreamReader & xml){
    if (
            xml.tokenType() != QXmlStreamReader::StartElement ||
            xml.name().toString() == "data")
          return;

    QString name = xml.name().toString();
    xml.readNext();
    QString text = xml.text().toString();

    data_config[name] = text;
}


void ConfigReader::xmlParse(QXmlStreamReader & xml){
    //xml.readNext();
    while (xml.tokenType() != QXmlStreamReader::EndElement )
    {
        while ( !xml.atEnd() ) {
              if(xml.name().toString().length() > 0 ) {
                  qDebug() <<  xml.name().toString() << " " << xml.readElementText();
            }
            xml.readNext();
        }
    }
}

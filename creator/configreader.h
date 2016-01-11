#ifndef CONFIGREADER_H
#define CONFIGREADER_H
#include <QMap>

class QXmlStreamReader;

class ConfigReader
{
public:
    ConfigReader();
    bool read();
    void saveConfig();
    QMap<QString, QString> data_config;
private:
    void setConfigKeys(QXmlStreamReader &);
    void xmlParse(QXmlStreamReader &);
};

#endif // CONFIGREADER_H

#ifndef CREATECONFIG_H
#define CREATECONFIG_H

#include <QObject>

class QFtp;

class createConfig : public QObject
{
    Q_OBJECT
public:
    explicit createConfig(QObject *parent = 0);
    void makePhoto();
signals:

public slots:
};

#endif // CREATECONFIG_H

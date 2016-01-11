#include "createconfig.h"
#include <QStringList>
#include <QUrl>
#include <QtNetwork/QNetworkAccessManager>
#include <QtNetwork/QNetworkRequest>
#include <QtNetwork/QNetworkReply>

#include <QDirIterator>
#include <qiterator.h>
#include <QCryptographicHash>
#include <QDate>
#include <CImg.h>
#include <iostream>
#include <QByteArray>



using namespace cimg_library;

createConfig::createConfig(QObject *parent) : QObject(parent)
{
}

void createConfig::makePhoto(){

}


/*
 *
 *     QDir dir("/var/www/text_img");
    QFile f("/var/www/0.jpg");
    f.open(QIODevice::ReadOnly);
    qDebug() << f.size();
    QFile * file = new QFile("/var/www/0.jpg", this);

    file->open(QIODevice::ReadOnly);
    qDebug() << file->size();


        QNetworkReply * reply;

        QUrl uploadurl("ftp://localhost/var/www/img.jpg");
        uploadurl.setPassword("q1w2e3r45ty6");
        uploadurl.setUserName("alex");
        uploadurl.setPort(21);

        QNetworkRequest upload(uploadurl);
        QNetworkAccessManager * uploadman = new QNetworkAccessManager(this);

        reply = uploadman->put(upload, &f);


        if (reply->error() == QNetworkReply::NoError)
        {
            qDebug() << "No errors occured";
        }
        qDebug() << reply->header(QNetworkRequest::ContentTypeHeader).toString();
        qDebug() << reply->header(QNetworkRequest::LastModifiedHeader).toDateTime().toString();;
        qDebug() << reply->header(QNetworkRequest::ContentLengthHeader).toULongLong();
        qDebug() << reply->attribute(QNetworkRequest::HttpStatusCodeAttribute).toInt();
        qDebug() << reply->attribute(QNetworkRequest::HttpReasonPhraseAttribute).toString();



        file->flush();
        file->close();
*/

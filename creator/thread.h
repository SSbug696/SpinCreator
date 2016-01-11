#ifndef THREAD_H
#define THREAD_H

#include <QObject>

class Thread : public QObject
{
    Q_OBJECT
    QThread workerThread;

public slots:
    void doWork(const QString &parameter) {
        emit resultReady(result);
    }

signals:
    void resultReady(const QString &result);
};

#endif // THREAD_H

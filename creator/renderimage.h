#ifndef RENDERIMAGE_H
#define RENDERIMAGE_H

#include <QObject>
#include <QThread>

class MainWindow;

class RenderImage : public QThread
{
    Q_OBJECT
public:
    RenderImage(MainWindow *, QString);

private:
    void run();
    bool do_run;
    MainWindow * data_class;
    QString current_directory;


signals:
public slots:
};

#endif // RENDERIMAGE_H

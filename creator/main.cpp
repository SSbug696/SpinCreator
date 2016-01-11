#include "mainwindow.h"
#include <QApplication>

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();

    return a.exec();
}


/*
 *
 *  QMAKE_CXXFLAGS += -lX11 -lpthread
    QMAKE_CFLAGS += -lX11 -lpthread
 *
 * */

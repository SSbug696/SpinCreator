QT       += core gui network
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = photo
TEMPLATE = app

SOURCES += main.cpp\
        mainwindow.cpp \
    renderimage.cpp \
    configreader.cpp \
    createspinconfigscript.cpp

HEADERS  += mainwindow.h \
    renderimage.h \
    configreader.h \
    createspinconfigscript.h


FORMS    += mainwindow.ui

LIBS +=  -lX11 -lpthread
CONFIG += static

#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include <QList>
#include <QMap>
#include <QArrayData>
#include <QVector>

class QProgressDialog;
class createConfig;
class ConfigReader;
class RenderImage;
class CreateSpinConfigScript;
class QMutex;


namespace Ui {
    class MainWindow;
}

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);

    QString getRoute(QString);

    Ui::MainWindow *ui;
    QList <int> list;
    QMap <QString, QString> data_config;
    QString basic_catalog;
    int compress_value;
    QString to;
    QString path_to_ico;
    QString current_spin_directory;
    QString basic_extension;

    QMutex * _mutex;
    CreateSpinConfigScript * spin_config;
    QString hash_cat;
    QList <QString> active_cat;
    QMap <QString, bool> category;
    QMap <QString, int> animate_category_status;

    QMap <QString, QVector<int> > size_category;
    QMap <QString,  QMap<int, QString> > hash_names_array;
    bool hash_name_status;

    QProgressDialog * progress;
    QString getURL();
    QString getPathToImage();
    QList <QString> getSizeImage();

    int progress_value;
    float progress_download;
    bool setProgressValue(float);
    QString getStringDescription();
    QString separator;

    ~MainWindow();

private:
    bool is_run;
    ConfigReader * config_reader;
    void ReadDir(QString path);
    void setBasicOptions();
    bool checkInputs();
    void makeDir();
    QMap <QString, RenderImage *> threads;
    QMap <QString, QString>  config;
    void updateConfig();
    void selectFolder(int i);
    bool is_rotate,
         is_transform,
         is_fragment;

    int current_w_size, current_h_size;

private slots:
        void hashNameStatus();
        void changeAnimateStatus();
        void selectIcon();
        void updateSpin(double);
        void changeTo();
        void on_pushButton_3_clicked();
        void on_pushButton_2_clicked();
        void on_pushButton_clicked();
        void on_generate_button_clicked();
        void closeProgressDialog();
        void on_selectSpinDir_clicked();
        void on_pushButton_4_clicked();
};

#endif // MAINWINDOW_H

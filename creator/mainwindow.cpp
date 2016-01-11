#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <QDir>
#include <QFileInfoList>
#include <QFileDialog>
#include <QDebug>
#include <QStringList>
#include <QDirIterator>
#include <QCryptographicHash>
#include <QDate>
#include <iostream>
#include <QByteArray>
#include <math.h>
#include <renderimage.h>
#include <QProgressDialog>
#include <qiterator.h>
#include <createconfig.h>
#include <createspinconfigscript.h>
#include <configreader.h>
#include <QMutex>

MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    this->setWindowTitle("Spin generator");

    _mutex = new QMutex();
    spin_config = new CreateSpinConfigScript(this);
    config_reader = new ConfigReader;
    setBasicOptions();

    is_run = false;
    current_h_size = 0;
    current_w_size = 0;

    is_rotate = false;
    is_fragment = false;
    is_transform = false;


    category["rotate"] = false;
    category["fragment"] = false;
    category["transform"] = false;


    QVector <int> r;
    r.push_back(0);
    r.push_back(0);


    size_category["rotate"] = r;
    size_category["fragment"] = r;
    size_category["transform"]= r;

    separator = QDir::separator();
    compress_value = 80;
    to = "local";

    animate_category_status["rotate_animate"] = 1;
    animate_category_status["fragment_animate"] = 0;
    animate_category_status["transform_animate"] = 1;


    progress = new QProgressDialog("Processing tasks", "Stop", 0, 100, this);
    //progress->setModal(false);
    //progress->setWindowModality(Qt::WindowModal);
    progress->cancel();

    this->connect(ui->compress_spin, SIGNAL(valueChanged(double)), this,  SLOT(updateSpin(double)));
    this->connect(progress, SIGNAL(canceled()), this, SLOT(closeProgressDialog()));
    this->connect(ui->localSave, SIGNAL(clicked(bool)), this, SLOT(changeTo()));
    this->connect(ui->serverSave, SIGNAL(clicked(bool)), this, SLOT(changeTo()));
    this->connect(ui->selectIcon , SIGNAL(clicked(bool)), this, SLOT(selectIcon()));

    //this->connect(ui->fragment_animate, SIGNAL(clicked(bool)), this, SLOT(changeAnimateStatus()));
    this->connect(ui->rotate_animate, SIGNAL(clicked(bool)), this, SLOT(changeAnimateStatus()));
    this->connect(ui->transform_animate, SIGNAL(clicked(bool)), this, SLOT(changeAnimateStatus()));

    this->connect(ui->hashNameCheckBox, SIGNAL(clicked(bool)), this, SLOT(hashNameStatus()));

    basic_extension = ".jpg";
}


MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::setBasicOptions(){
    if(!config_reader->read()) return;

    ui->pathToIcon->setText(config_reader->data_config["urlico"]);
    ui->urlText->setText(config_reader->data_config["site"]);
    ui->height_ico->setValue(config_reader->data_config["height"].toInt());
    ui->width_ico->setValue(config_reader->data_config["width"].toInt());

    if(config_reader->data_config["save_type"] == "server"){
        ui->serverSave->setChecked(true);
        to = "server";
    }

    ui->hashNameCheckBox->setChecked(config_reader->data_config["hashfile"].toInt());
    ui->descriptionSpin->setText(config_reader->data_config["description"]);
    ui->spinDirectory->setText(config_reader->data_config["sdirectory"]);
}


void MainWindow::updateConfig(){
    config_reader->data_config["urlico"] = ui->pathToIcon->toPlainText();
    config_reader->data_config["site"] = ui->urlText->toPlainText();
    config_reader->data_config["height"] = QString::number( ui->height_ico->value() );
    config_reader->data_config["width"] = QString::number( ui->width_ico->value() );
    config_reader->data_config["hashfile"] = ui->hashNameCheckBox->isChecked() ? "1" : "0";
    config_reader->data_config["save_type"] = ui->serverSave->isChecked() ? "server" : "local";
    config_reader->data_config["description"] = ui->descriptionSpin->toPlainText();
    config_reader->data_config["sdirectory"] = ui->spinDirectory->toPlainText();
    config_reader->data_config["compress"] = QString::number( ui->compress_spin->value() );
}


void MainWindow::selectFolder(int i){
    const QString tr = "Open file";
    QString file = QFileDialog::getExistingDirectory(this, QDir::homePath(), QString("Multimedia files(*)"));

    if(file.isEmpty()){
        switch(i){
            case 1:
                if( category["rotate"] ) category["rotate"] = false;
                this->ui->textEdit->setText(file + separator);
            break;

            case 2:
                if( category["fragment"] ) category["fragment"] = false;
                this->ui->textEdit_2->setText(file + separator);
            break;

            case 3:
                if( category["transform"] ) category["transform"] = false;
                this->ui->textEdit_3->setText(file + separator);
            break;

        }
    } else {
        switch(i){
            case 1:
                this->ui->textEdit->setText(file);
                this->ReadDir(this->ui->textEdit->toPlainText());
                category["rotate"] = true;
                qDebug() << " size ::: " << current_w_size << " <<>>  " << current_h_size;
                size_category["rotate"][0] = current_w_size;
                size_category["rotate"][1] = current_h_size;
            break;

            case 2:
                this->ui->textEdit_2->setText(file);
                this->ReadDir(this->ui->textEdit_2->toPlainText());
                category["fragment"] = true;
                size_category["fragment"][0] = current_w_size;
            break;

            case 3:
                this->ui->textEdit_3->setText(file);
                this->ReadDir(this->ui->textEdit_3->toPlainText());
                category["transform"] = true;
                size_category["transform"][0] = current_w_size;
                qDebug() << "transform is " << QString::number(current_w_size);
            break;
        }
    }

    current_w_size = 0;
    current_h_size = 0;
}


void MainWindow::hashNameStatus(){
    hash_name_status =  ui->hashNameCheckBox->isChecked();
    qDebug() << "hash status " << hash_name_status;
}


void MainWindow::changeAnimateStatus(){
    animate_category_status.uniqueKeys();
    /*
    if (ui->fragment_animate->isChecked()){
        animate_category_status["fragment_animate"] = 1;
    } else animate_category_status["fragment_animate"] = 0;
*/
    if (ui->transform_animate->isChecked()){
        animate_category_status["transform_animate"] = 1;
    } else animate_category_status["transform_animate"] = 0;

    if (ui->rotate_animate->isChecked()){
        animate_category_status["rotate_animate"] = 1;
    } else animate_category_status["rotate_animate"] = 0;
}


void MainWindow::on_pushButton_3_clicked(){
    this->selectFolder(3);
}


void MainWindow::on_pushButton_2_clicked(){
    this->selectFolder(2);
}


void MainWindow::on_pushButton_clicked(){
    this->selectFolder(1);
}


void MainWindow::selectIcon(){
    ui->pathToIcon->setText( QFileDialog::getOpenFileName(this, QDir::homePath(), QString("Image Files(*.png)")) );
    //QString file = QFileDialog::getExistingDirectory(this, QDir::homePath(), QString("Multimedia files(*)"));
    //path_to_ico;
}


void MainWindow::closeProgressDialog(){
    qDebug() << "render process stopped";
    is_run = false;
    progress->setValue(0);
    progress->cancel();
}


void MainWindow::updateSpin(double val){
    compress_value = (int)val;
    //qDebug() << "changed spin value" << QString::number(compress_value);
}


bool MainWindow::setProgressValue(float num){
    _mutex->lock();
    progress_download += num;
    progress->setValue(progress_download);
    if(progress_download > 100){
        spin_config->buildSpinConfig();
        progress->setValue(0);
        progress->hide();

        updateConfig();
        config_reader->saveConfig();
        //progress->close();
    }
    _mutex->unlock();
    return is_run;
}


QList<QString> MainWindow::getSizeImage(){
   QList<QString> list;
   list.push_back(ui->width_ico->text());
   list.push_back(ui->height_ico->text());
   return list;
}


QString MainWindow::getURL(){
    return ui->urlText->toPlainText();
}


QString MainWindow::getPathToImage(){
    return ui->pathToIcon->toPlainText();
}


QString MainWindow::getRoute(QString category){
    QString path;
    if (category == "rotate"){
            path = this->ui->textEdit->toPlainText();
    } else if (category == "fragment") {
            path = this->ui->textEdit_2->toPlainText();
    } else if (category == "transform") {
            path = this->ui->textEdit_3->toPlainText();
    }
    return path + separator;
}


void MainWindow::ReadDir(QString path){
    QDir dir(path);
    QRegExp r_w("img_\\d+_(\\d+)_(\\d+)");

    int max_w_number = 0,
        max_h_number = 0;


    QDirIterator it(path, QStringList() << "*.jpg", QDir::Files, QDirIterator::Subdirectories);

    while (it.hasNext()) {
        int pos = 0;
        while ((pos = r_w.indexIn(it.fileInfo().baseName(), pos)) != -1) {
            if(r_w.cap(2).toInt() > max_w_number){
                max_w_number = r_w.cap(2).toInt();
            }

            if(r_w.cap(1).toInt() > max_h_number){
                max_h_number = r_w.cap(1).toInt();
            }

            pos += r_w.matchedLength();
        }

       it.next();
    }
    current_w_size = max_w_number;
    current_h_size = max_h_number;
}


bool MainWindow::checkInputs(){
    bool status = false;
    if (
        this->ui->textEdit->toPlainText().length() > 0 ||
        this->ui->textEdit_2->toPlainText().length() > 0 ||
        this->ui->textEdit_3->toPlainText().length() > 0
      ) status = true;


    if (status){
        // if (progress.wasCanceled())
        //   break;

        progress->setValue(0);
        progress->show();
    }

    return status;
}


QString MainWindow::getStringDescription(){
    return ui->descriptionSpin->toPlainText();
}


void MainWindow::makeDir(){
    QByteArray byte_arr;
    QString item;

    hash_cat = QDate::currentDate().toString() + QTime::currentTime().toString();
    byte_arr = hash_cat.toUtf8();
    basic_catalog = QString("spin_") + QCryptographicHash::hash(byte_arr, QCryptographicHash::Sha1).toHex();
    hash_cat =  basic_catalog;

    QString path = current_spin_directory.length() > 0 ? current_spin_directory : QDir::currentPath();
    basic_catalog = path + separator + basic_catalog;

    if (!QDir(basic_catalog).exists()) {
       QDir().mkdir(basic_catalog);

       QMap<QString, bool>::iterator i;

       for (i = category.begin(); i != category.end(); ++i){
            if (i.value() == true) {
                QDir(basic_catalog).mkdir(i.key());
                item = basic_catalog + separator + i.key();
                QDir(item).mkdir("small");
                QDir(item).mkdir("full");
            }
       }
    }
}


void MainWindow::changeTo(){
    if( ui->localSave->isChecked() ){
        to = "local";
    } else to = "server";
}


void MainWindow::on_generate_button_clicked()
{
    QString file_name;
    QByteArray byte_arr;
    QString file_hash;
    QString hash;
    if(checkInputs()){
        progress_download = 0.0;
        progress_value = 0;

        makeDir();

        progress->open();
        progress->setWindowModality(Qt::WindowModal);

        //hashNameCheckBox
        hash_name_status = ui->hashNameCheckBox->isChecked();

        QMap<QString, bool>::iterator it, start_thread_it;
        for (it = category.begin(); it != category.end(); ++it) {
            if ( size_category[it.key()][0] > 0 ) {
                threads[it.key()] = new RenderImage(this, it.key());

                int current = 0;
                for (int h=0; h <= size_category[it.key()][1]; h++ ) {
                    for (int w=0; w <= size_category[it.key()][0]; w++) {
                        file_name = "img_0_" + QString::number(h) + QString("_") + QString::number(w);

                        hash = QDate::currentDate().toString() + QTime::currentTime().toString() + QString::number(rand());
                        byte_arr = hash.toUtf8();

                        file_hash = QCryptographicHash::hash(byte_arr, QCryptographicHash::Md4).toHex();


                        hash_names_array[it.key() + "_small"][current] = "f" + file_hash;

                        hash = QDate::currentDate().toString() + QTime::currentTime().toString() + QString::number(rand());
                        byte_arr = hash.toUtf8();
                        file_hash = QCryptographicHash::hash(byte_arr, QCryptographicHash::Md4).toHex();

                        hash_names_array[it.key() + "_full"][current] = "f" + file_hash;
                        current ++;
                    }
                }
            }
        }

        for (start_thread_it = category.begin(); start_thread_it != category.end(); ++start_thread_it){
            if ( size_category[start_thread_it.key()][0] > 0 ) {
                threads[start_thread_it.key()]->start();
            }
        }

        is_run = true;
    }
}


void MainWindow::on_selectSpinDir_clicked()
{
    QString file = QFileDialog::getExistingDirectory(this, QDir::homePath(), QString("Multimedia files(*)"));
    ui->spinDirectory->setPlainText(file);
    current_spin_directory = file;
}


void MainWindow::on_pushButton_4_clicked()
{
    ConfigReader readXML;
    readXML.read();
}

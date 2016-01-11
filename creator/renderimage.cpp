#include "renderimage.h"
#include "mainwindow.h"
#include <QDir>
#include <QDebug>
#include <QProgressDialog>
#include <math.h>

RenderImage::RenderImage(MainWindow * obj, QString directory)
{
    current_directory = directory;
    data_class = obj;
    do_run = true;

    if(current_directory == "rotate"){
        data_class->progress_value +=
                (
                    (data_class->size_category[current_directory][0] + 1) *
                    (data_class->size_category[current_directory][1] + 1)
                );
    } else {
        data_class->progress_value += ( data_class->size_category[current_directory][0] + 1 );
    }
}


void RenderImage::run(){
    QString path_to_file;
    QString path;
    QString file_begin = "img_0_",
            file_end = ".jpg", file_name;

    QString separator = QDir::separator();

    QPixmap img_full;
    QPixmap img_small;

    int result_w = 0,
        result_h = 0;

    int width, height, counter = 0;

    double coeff_h, coeff_w;
    float step_generate = 0.0;

    step_generate = ( 101.0 / (float)data_class->progress_value );

    for(int h=0; h <= data_class->size_category[current_directory][1] && do_run; h++ ){
        for(int w=0; w <= data_class->size_category[current_directory][0] && do_run; w++){

            path = data_class->getRoute(current_directory);
            path_to_file = path + file_begin + QString::number(h) + QString("_") + QString::number(w) + file_end;

            //qDebug() << path_to_file;
            //path for small image
            if(data_class->hash_name_status == true){
                file_name = data_class->hash_names_array[current_directory + "_small"][counter] + file_end;
            } else {
                file_name = "img_0_"+ QString::number(h) + QString("_") + QString::number(w) + file_end;
            }

            path = data_class->basic_catalog + separator + current_directory + separator + QString("small") + data_class->separator + file_name;

            QImage img2(path_to_file);

            width = img2.width();
            height = img2.height();

            coeff_h = (float)width / (float)height;
            coeff_w = (float)height / (float)width;

            width = (int)width;
            height = (int)height;

            if(width != 600 || height !=600){
                if(width > height) {
                    result_w = 600;
                    result_h = 600 * coeff_w;
                } else if(width < height) {
                    result_w = 600 * coeff_h;
                    result_h = 603;
                } else {
                    result_h = 600;
                    result_w = 600;
                }
             } else {
                result_h = 600;
                result_w = 600;
             }


            img_small = img_small.fromImage(img2.scaled(result_w, result_h, Qt::IgnoreAspectRatio, Qt::SmoothTransformation));
            QFile file2(path);
            file2.open(QIODevice::WriteOnly);
            img_small.save(&file2, "jpeg", data_class->compress_value);
            file2.close();

            if(width != 1800 || height != 1800){
                if(width > height) {
                    result_w = 1800;
                    result_h = 1800 * coeff_w;
                } else if(width < height) {
                    result_w = 1800 * coeff_h;
                    result_h = 1800;
                } else {
                    result_h = 1800;
                    result_w = 1800;
                }
            } else {
                result_h = 1800;
                result_w = 1800;
            }

            if(data_class->hash_name_status == true){
                file_name = data_class->hash_names_array[current_directory + "_full"][counter] + file_end;
            } else {
                file_name = "img_0_"+ QString::number(h) + QString("_") + QString::number(w) + file_end;
            }

            path = data_class->basic_catalog + separator + current_directory + separator + QString("full") + data_class->separator + file_name;

            QImage img(path_to_file);
            img_full = img_full.fromImage(img.scaled(result_w, result_h, Qt::IgnoreAspectRatio, Qt::SmoothTransformation));
            QFile file(path);
            file.open(QIODevice::WriteOnly);
            img_full.save(&file, "jpeg", data_class->compress_value);
            file.close();

            do_run = data_class->setProgressValue(step_generate);
            counter ++;
        }
    }
}

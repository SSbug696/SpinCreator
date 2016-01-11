#ifndef CREATESPINCONFIGSCRIPT_H
#define CREATESPINCONFIGSCRIPT_H

class MainWindow;

class CreateSpinConfigScript
{
public:
    CreateSpinConfigScript(MainWindow *);
    MainWindow * data;
    int buildSpinConfig();
};

#endif // CREATESPINCONFIGSCRIPT_H

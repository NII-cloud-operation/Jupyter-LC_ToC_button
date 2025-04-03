FROM jupyter/scipy-notebook:latest

USER root

COPY . /tmp/table_of_contents
RUN pip install --no-cache /tmp/table_of_contents

RUN jupyter labextension enable table_of_contents

RUN fix-permissions /home/$NB_USER

USER $NB_USER
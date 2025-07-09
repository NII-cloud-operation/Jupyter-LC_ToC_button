FROM quay.io/jupyter/scipy-notebook:lab-4.4.4

USER root

# instaill Node.js v20.x because Node.js is not installed with quay.io/jupyter/scipy-notebook
RUN apt-get update && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get install -y nodejs \
  && npm install -g yarn

COPY . /tmp/table_of_contents
RUN pip install --no-cache /tmp/table_of_contents

RUN jupyter labextension enable table_of_contents

RUN fix-permissions /home/$NB_USER

USER $NB_USER
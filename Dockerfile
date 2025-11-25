FROM quay.io/jupyter/scipy-notebook:notebook-7.5.0

USER root

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && \
    mkdir -p /.npm && \
    chown jovyan:users -R /.npm && \
    rm -rf /var/lib/apt/lists/*
ENV NPM_CONFIG_PREFIX=/.npm
ENV PATH=/.npm/bin/:${PATH}

COPY . /tmp/table_of_contents
RUN pip install --no-cache /tmp/table_of_contents

RUN jupyter labextension enable table_of_contents

RUN fix-permissions /home/$NB_USER

USER $NB_USER
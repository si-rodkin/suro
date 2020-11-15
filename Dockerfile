from alpine

WORKDIR /usr/src

RUN apk add --no-cache openrc python3 python3-dev py3-pip gcc musl-dev zlib-dev libjpeg-turbo-dev

COPY . /usr/src
COPY nginx.conf /etc/nginx/nginx.conf

RUN pip3 install --upgrade --no-cache-dir pip
RUN pip3 install --no-cache-dir -r requirements.txt

# RUN rc-service nginx stop && rc-service nginx start

# CMD gunicorn eye_of_sauron.wsgi
CMD python3 manage.py runserver $SURO_ADDR

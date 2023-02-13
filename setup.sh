wget https://dlcdn.apache.org/zookeeper/zookeeper-3.7.0/apache-zookeeper-3.7.0-bin.tar.gz
tar -xzvf apache-zookeeper-3.7.0-bin.tar.gz
rm apache-zookeeper-3.7.0-bin.tar.gz
mv ./apache-zookeeper-3.7.0-bin/conf/zoo_sample.cfg ./apache-zookeeper-3.7.0-bin/conf/zoo.cfg

wget https://dlcdn.apache.org/kafka/3.0.0/kafka_2.12-3.0.0.tgz
tar -xzvf kafka_2.12-3.0.0.tgz
rm kafka_2.12-3.0.0.tgz

# Run the following (1st and 2nd) commands in two different terminals to start Kafka
# ./apache-zookeeper-3.7.0-bin/bin/zkServer.sh start-foreground
# ./kafka_2.12-3.0.0/bin/kafka-server-start.sh ./kafka_2.12-3.0.0/config/server.properties
# ./kafka_2.12-3.0.0/bin/kafka-topics.sh --create --replication-factor 1 --partitions 1 --bootstrap-server localhost:9092 --topic my_topic

orissolomonia@instance-20260211-112425:~$ docker logs brooks-pins-service

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.5)

2026-02-11T20:00:55.005Z  INFO 1 --- [           main] com.brooks.pins.PinsServiceApplication   : Starting PinsServiceApplication using Java 17.0.18 with PID 1 (/app/app.jar started by root in /app)
2026-02-11T20:00:55.258Z  INFO 1 --- [           main] com.brooks.pins.PinsServiceApplication   : No active profile set, falling back to 1 default profile: "default"
2026-02-11T20:03:49.018Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2026-02-11T20:03:49.042Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-02-11T20:04:02.042Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 10755 ms. Found 4 JPA repository interfaces.
2026-02-11T20:04:03.012Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2026-02-11T20:04:03.030Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data Redis repositories in DEFAULT mode.
2026-02-11T20:04:04.017Z  INFO 1 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.brooks.pins.PinRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2026-02-11T20:04:04.024Z  INFO 1 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.brooks.pins.PinNotificationStateRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2026-02-11T20:04:04.026Z  INFO 1 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.brooks.pins.PinMediaRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2026-02-11T20:04:04.033Z  INFO 1 --- [           main] .RepositoryConfigurationExtensionSupport : Spring Data Redis - Could not safely identify store assignment for repository candidate interface com.brooks.pins.PinAclRepository; If you want this repository to be a Redis repository, consider annotating your entities with one of these annotations: org.springframework.data.redis.core.RedisHash (preferred), or consider extending one of the following types with your repository: org.springframework.data.keyvalue.repository.KeyValueRepository
2026-02-11T20:04:04.036Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 278 ms. Found 0 Redis repository interfaces.
2026-02-11T20:05:35.516Z  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8084 (http)
2026-02-11T20:05:36.001Z  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2026-02-11T20:05:36.002Z  INFO 1 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.20]
2026-02-11T20:05:37.010Z  INFO 1 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2026-02-11T20:05:37.012Z  INFO 1 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 269738 ms
2026-02-11T20:06:06.753Z  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-02-11T20:06:10.767Z ERROR 1 --- [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Exception during pool initialization.

org.postgresql.util.PSQLException: Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:342) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.<init>(PgConnection.java:263) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.Driver.makeConnection(Driver.java:443) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.Driver.connect(Driver.java:297) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:138) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:359) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:201) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:470) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:561) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:100) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:112) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.api.configuration.ClassicConfiguration.setDataSource(ClassicConfiguration.java:1094) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.api.configuration.FluentConfiguration.dataSource(FluentConfiguration.java:624) ~[flyway-core-9.22.3.jar!/:na]
        at org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration$FlywayConfiguration.configureDataSource(FlywayAutoConfiguration.java:185) ~[spring-boot-autoconfigure-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.autoconfigure.flyway.FlywayAutoConfiguration$FlywayConfiguration.flyway(FlywayAutoConfiguration.java:172) ~[spring-boot-autoconfigure-3.2.5.jar!/:3.2.5]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.beans.factory.support.SimpleInstantiationStrategy.instantiate(SimpleInstantiationStrategy.java:140) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.ConstructorResolver.instantiate(ConstructorResolver.java:644) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.ConstructorResolver.instantiateUsingFactoryMethod(ConstructorResolver.java:636) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.instantiateUsingFactoryMethod(AbstractAutowireCapableBeanFactory.java:1335) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBeanInstance(AbstractAutowireCapableBeanFactory.java:1165) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:562) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:522) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:326) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:234) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:324) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:200) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:313) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:200) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1234) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:952) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:624) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:754) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:456) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:334) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1354) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1343) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at com.brooks.pins.PinsServiceApplication.main(PinsServiceApplication.java:11) ~[!/:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:91) ~[app.jar:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53) ~[app.jar:na]
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58) ~[app.jar:na]
Caused by: java.net.ConnectException: Connection refused
        at java.base/sun.nio.ch.Net.pollConnect(Native Method) ~[na:na]
        at java.base/sun.nio.ch.Net.pollConnectNow(Unknown Source) ~[na:na]
        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source) ~[na:na]
        at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source) ~[na:na]
        at java.base/java.net.SocksSocketImpl.connect(Unknown Source) ~[na:na]
        at java.base/java.net.Socket.connect(Unknown Source) ~[na:na]
        at org.postgresql.core.PGStream.createSocket(PGStream.java:243) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.PGStream.<init>(PGStream.java:98) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:132) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:258) ~[postgresql-42.6.2.jar!/:42.6.2]
        ... 49 common frames omitted

2026-02-11T20:06:13.264Z  INFO 1 --- [           main] o.f.c.internal.license.VersionPrinter    : Flyway Community Edition 9.22.3 by Redgate
2026-02-11T20:06:13.270Z  INFO 1 --- [           main] o.f.c.internal.license.VersionPrinter    : See release notes here: https://rd.gt/416ObMi
2026-02-11T20:06:13.271Z  INFO 1 --- [           main] o.f.c.internal.license.VersionPrinter    : 
2026-02-11T20:06:13.534Z  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-02-11T20:06:14.536Z ERROR 1 --- [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Exception during pool initialization.

org.postgresql.util.PSQLException: Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:342) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.<init>(PgConnection.java:263) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.Driver.makeConnection(Driver.java:443) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.Driver.connect(Driver.java:297) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:138) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:359) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:201) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:470) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:561) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:100) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:112) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:48) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.JdbcConnectionFactory.<init>(JdbcConnectionFactory.java:74) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:142) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.Flyway.migrate(Flyway.java:140) ~[flyway-core-9.22.3.jar!/:na]
        at org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer.afterPropertiesSet(FlywayMigrationInitializer.java:66) ~[spring-boot-autoconfigure-3.2.5.jar!/:3.2.5]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1833) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1782) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:600) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:522) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:326) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:234) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:324) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:200) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:313) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:200) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1234) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:952) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:624) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:754) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:456) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:334) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1354) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1343) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at com.brooks.pins.PinsServiceApplication.main(PinsServiceApplication.java:11) ~[!/:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:91) ~[app.jar:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53) ~[app.jar:na]
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58) ~[app.jar:na]
Caused by: java.net.ConnectException: Connection refused
        at java.base/sun.nio.ch.Net.pollConnect(Native Method) ~[na:na]
        at java.base/sun.nio.ch.Net.pollConnectNow(Unknown Source) ~[na:na]
        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source) ~[na:na]
        at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source) ~[na:na]
        at java.base/java.net.SocksSocketImpl.connect(Unknown Source) ~[na:na]
        at java.base/java.net.Socket.connect(Unknown Source) ~[na:na]
        at org.postgresql.core.PGStream.createSocket(PGStream.java:243) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.PGStream.<init>(PGStream.java:98) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:132) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:258) ~[postgresql-42.6.2.jar!/:42.6.2]
        ... 43 common frames omitted

2026-02-11T20:06:14.544Z  WARN 1 --- [           main] ConfigServletWebServerApplicationContext : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Unable to obtain connection from database: Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

2026-02-11T20:06:14.757Z  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Stopping service [Tomcat]
2026-02-11T20:06:15.035Z  INFO 1 --- [           main] .s.b.a.l.ConditionEvaluationReportLogger : 

Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.
2026-02-11T20:06:16.291Z ERROR 1 --- [           main] o.s.boot.SpringApplication               : Application run failed

org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Unable to obtain connection from database: Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1786) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.doCreateBean(AbstractAutowireCapableBeanFactory.java:600) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.createBean(AbstractAutowireCapableBeanFactory.java:522) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.lambda$doGetBean$0(AbstractBeanFactory.java:326) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.DefaultSingletonBeanRegistry.getSingleton(DefaultSingletonBeanRegistry.java:234) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:324) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:200) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.doGetBean(AbstractBeanFactory.java:313) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractBeanFactory.getBean(AbstractBeanFactory.java:200) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.getBean(AbstractApplicationContext.java:1234) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.finishBeanFactoryInitialization(AbstractApplicationContext.java:952) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.context.support.AbstractApplicationContext.refresh(AbstractApplicationContext.java:624) ~[spring-context-6.1.6.jar!/:6.1.6]
        at org.springframework.boot.web.servlet.context.ServletWebServerApplicationContext.refresh(ServletWebServerApplicationContext.java:146) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.refresh(SpringApplication.java:754) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.refreshContext(SpringApplication.java:456) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:334) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1354) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at org.springframework.boot.SpringApplication.run(SpringApplication.java:1343) ~[spring-boot-3.2.5.jar!/:3.2.5]
        at com.brooks.pins.PinsServiceApplication.main(PinsServiceApplication.java:11) ~[!/:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:91) ~[app.jar:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53) ~[app.jar:na]
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58) ~[app.jar:na]
Caused by: org.flywaydb.core.internal.exception.FlywaySqlException: Unable to obtain connection from database: Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
SQL State  : 08001
Error Code : 0
Message    : Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.

        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:60) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.JdbcConnectionFactory.<init>(JdbcConnectionFactory.java:74) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:142) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.Flyway.migrate(Flyway.java:140) ~[flyway-core-9.22.3.jar!/:na]
        at org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer.afterPropertiesSet(FlywayMigrationInitializer.java:66) ~[spring-boot-autoconfigure-3.2.5.jar!/:3.2.5]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1833) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1782) ~[spring-beans-6.1.6.jar!/:6.1.6]
        ... 25 common frames omitted
Caused by: org.postgresql.util.PSQLException: Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:342) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.ConnectionFactory.openConnection(ConnectionFactory.java:54) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.<init>(PgConnection.java:263) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.Driver.makeConnection(Driver.java:443) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.Driver.connect(Driver.java:297) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.util.DriverDataSource.getConnection(DriverDataSource.java:138) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.PoolBase.newConnection(PoolBase.java:359) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.PoolBase.newPoolEntry(PoolBase.java:201) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.createPoolEntry(HikariPool.java:470) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.checkFailFast(HikariPool.java:561) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariPool.<init>(HikariPool.java:100) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.HikariDataSource.getConnection(HikariDataSource.java:112) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.JdbcUtils.openConnection(JdbcUtils.java:48) ~[flyway-core-9.22.3.jar!/:na]
        ... 31 common frames omitted
Caused by: java.net.ConnectException: Connection refused
        at java.base/sun.nio.ch.Net.pollConnect(Native Method) ~[na:na]
        at java.base/sun.nio.ch.Net.pollConnectNow(Unknown Source) ~[na:na]
        at java.base/sun.nio.ch.NioSocketImpl.timedFinishConnect(Unknown Source) ~[na:na]
        at java.base/sun.nio.ch.NioSocketImpl.connect(Unknown Source) ~[na:na]
        at java.base/java.net.SocksSocketImpl.connect(Unknown Source) ~[na:na]
        at java.base/java.net.Socket.connect(Unknown Source) ~[na:na]
        at org.postgresql.core.PGStream.createSocket(PGStream.java:243) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.PGStream.<init>(PGStream.java:98) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.ConnectionFactoryImpl.tryConnect(ConnectionFactoryImpl.java:132) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.ConnectionFactoryImpl.openConnectionImpl(ConnectionFactoryImpl.java:258) ~[postgresql-42.6.2.jar!/:42.6.2]
        ... 43 common frames omitted

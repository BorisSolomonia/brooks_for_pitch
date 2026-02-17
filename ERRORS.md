/\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.5)

2026-02-12T19:59:45.103Z  INFO 1 --- [           main] c.brooks.lists.ListsServiceApplication   : Starting ListsServiceApplication using Java 17.0.18 with PID 1 (/app/app.jar started by root in /app)
2026-02-12T19:59:45.312Z  INFO 1 --- [           main] c.brooks.lists.ListsServiceApplication   : No active profile set, falling back to 1 default profile: "default"
2026-02-12T20:01:15.582Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data JPA repositories in DEFAULT mode.
2026-02-12T20:01:18.853Z  INFO 1 --- [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 3015 ms. Found 2 JPA repository interfaces.
2026-02-12T20:02:13.576Z  INFO 1 --- [           main] o.s.b.w.embedded.tomcat.TomcatWebServer  : Tomcat initialized with port 8083 (http)
2026-02-12T20:02:16.065Z  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Starting service [Tomcat]
2026-02-12T20:02:16.072Z  INFO 1 --- [           main] o.apache.catalina.core.StandardEngine    : Starting Servlet engine: [Apache Tomcat/10.1.20]
2026-02-12T20:02:19.808Z  INFO 1 --- [           main] o.a.c.c.C.[Tomcat].[localhost].[/]       : Initializing Spring embedded WebApplicationContext
2026-02-12T20:02:19.828Z  INFO 1 --- [           main] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 149982 ms
2026-02-12T20:02:46.850Z  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Starting...
2026-02-12T20:03:15.575Z  INFO 1 --- [           main] com.zaxxer.hikari.pool.HikariPool        : HikariPool-1 - Added connection org.postgresql.jdbc.PgConnection@77cddc0c
2026-02-12T20:03:15.586Z  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Start completed.
2026-02-12T20:03:25.571Z  INFO 1 --- [           main] o.f.c.internal.license.VersionPrinter    : Flyway Community Edition 9.22.3 by Redgate
2026-02-12T20:03:25.571Z  INFO 1 --- [           main] o.f.c.internal.license.VersionPrinter    : See release notes here: https://rd.gt/416ObMi
2026-02-12T20:03:25.571Z  INFO 1 --- [           main] o.f.c.internal.license.VersionPrinter    : 
2026-02-12T20:03:31.577Z  INFO 1 --- [           main] org.flywaydb.core.FlywayExecutor         : Database: jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres (PostgreSQL 17.6)
2026-02-12T20:03:37.556Z  WARN 1 --- [           main] o.f.c.internal.database.base.Database    : Flyway upgrade recommended: PostgreSQL 17.6 is newer than this version of Flyway and support has not been tested. The latest supported version of PostgreSQL is 15.
2026-02-12T20:03:42.051Z  INFO 1 --- [           main] o.f.core.internal.command.DbValidate     : Successfully validated 2 migrations (execution time 00:03.984s)
2026-02-12T20:03:46.564Z  INFO 1 --- [           main] o.f.core.internal.command.DbMigrate      : Current version of schema "public": << Empty Schema >>
2026-02-12T20:03:48.071Z  INFO 1 --- [           main] o.f.core.internal.command.DbMigrate      : Migrating schema "public" to version "1 - init"
2026-02-12T20:03:50.323Z ERROR 1 --- [           main] o.f.c.i.j.TransactionalExecutionTemplate : Unable to rollback transaction

org.postgresql.util.PSQLException: ERROR: prepared statement "S_1" already exists
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2713) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2401) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:368) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:327) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.executeTransactionCommand(PgConnection.java:965) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.rollback(PgConnection.java:1008) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.pool.ProxyConnection.rollback(ProxyConnection.java:385) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariProxyConnection.rollback(HikariProxyConnection.java) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:71) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.applyMigrations(DbMigrate.java:271) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateGroup(DbMigrate.java:244) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.lambda$migrateAll$0(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:73) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.lambda$execute$0(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:55) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLConnection.lock(PostgreSQLConnection.java:96) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.lock(JdbcTableSchemaHistory.java:144) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateAll(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrate(DbMigrate.java:97) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.Flyway.lambda$migrate$0(Flyway.java:188) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:213) ~[flyway-core-9.22.3.jar!/:na]
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
        at com.brooks.lists.ListsServiceApplication.main(ListsServiceApplication.java:9) ~[!/:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:91) ~[app.jar:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53) ~[app.jar:na]
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58) ~[app.jar:na]

2026-02-12T20:03:51.049Z ERROR 1 --- [           main] o.f.c.i.j.TransactionalExecutionTemplate : Unable to restore autocommit to original value for connection

org.postgresql.util.PSQLException: ERROR: prepared statement "S_2" already exists
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2713) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2401) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:368) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:327) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.executeTransactionCommand(PgConnection.java:965) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.commit(PgConnection.java:987) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.setAutoCommit(PgConnection.java:929) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.pool.ProxyConnection.setAutoCommit(ProxyConnection.java:401) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariProxyConnection.setAutoCommit(HikariProxyConnection.java) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:86) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.applyMigrations(DbMigrate.java:271) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateGroup(DbMigrate.java:244) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.lambda$migrateAll$0(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:73) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.lambda$execute$0(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:55) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLConnection.lock(PostgreSQLConnection.java:96) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.lock(JdbcTableSchemaHistory.java:144) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateAll(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrate(DbMigrate.java:97) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.Flyway.lambda$migrate$0(Flyway.java:188) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:213) ~[flyway-core-9.22.3.jar!/:na]
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
        at com.brooks.lists.ListsServiceApplication.main(ListsServiceApplication.java:9) ~[!/:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:91) ~[app.jar:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53) ~[app.jar:na]
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58) ~[app.jar:na]
Caused by: org.postgresql.util.PSQLException: ERROR: prepared statement "S_1" already exists
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2713) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2401) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:368) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:327) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.executeTransactionCommand(PgConnection.java:965) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.rollback(PgConnection.java:1008) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.pool.ProxyConnection.rollback(ProxyConnection.java:385) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariProxyConnection.rollback(HikariProxyConnection.java) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:71) ~[flyway-core-9.22.3.jar!/:na]
        ... 42 common frames omitted

2026-02-12T20:03:51.299Z ERROR 1 --- [           main] o.f.c.i.j.TransactionalExecutionTemplate : Unable to rollback transaction

org.postgresql.util.PSQLException: ERROR: prepared statement "S_3" already exists
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2713) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2401) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:368) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:327) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.executeTransactionCommand(PgConnection.java:965) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgConnection.rollback(PgConnection.java:1008) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.pool.ProxyConnection.rollback(ProxyConnection.java:385) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariProxyConnection.rollback(HikariProxyConnection.java) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:71) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLConnection.lock(PostgreSQLConnection.java:96) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.lock(JdbcTableSchemaHistory.java:144) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateAll(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrate(DbMigrate.java:97) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.Flyway.lambda$migrate$0(Flyway.java:188) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:213) ~[flyway-core-9.22.3.jar!/:na]
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
        at com.brooks.lists.ListsServiceApplication.main(ListsServiceApplication.java:9) ~[!/:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:91) ~[app.jar:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53) ~[app.jar:na]
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58) ~[app.jar:na]
Caused by: org.postgresql.util.PSQLException: ERROR: prepared statement "S_2" already exists
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2713) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2401) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:368) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgStatement.executeInternal(PgStatement.java:498) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgStatement.execute(PgStatement.java:415) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgPreparedStatement.executeWithFlags(PgPreparedStatement.java:190) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgPreparedStatement.execute(PgPreparedStatement.java:177) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.pool.ProxyPreparedStatement.execute(ProxyPreparedStatement.java:44) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariProxyPreparedStatement.execute(HikariProxyPreparedStatement.java) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.JdbcTemplate.execute(JdbcTemplate.java:182) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLConnection.doRestoreOriginalState(PostgreSQLConnection.java:44) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.base.Connection.restoreOriginalState(Connection.java:130) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.exists(JdbcTableSchemaHistory.java:97) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.allAppliedMigrations(JdbcTableSchemaHistory.java:188) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.SchemaHistory.calculateInstalledRank(SchemaHistory.java:208) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.SchemaHistory.addAppliedMigration(SchemaHistory.java:189) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.doMigrateGroup(DbMigrate.java:400) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.lambda$applyMigrations$1(DbMigrate.java:272) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:55) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.applyMigrations(DbMigrate.java:271) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateGroup(DbMigrate.java:244) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.lambda$migrateAll$0(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:73) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.lambda$execute$0(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:55) ~[flyway-core-9.22.3.jar!/:na]
        ... 36 common frames omitted

2026-02-12T20:03:51.807Z  WARN 1 --- [           main] ConfigServletWebServerApplicationContext : Exception encountered during context initialization - cancelling refresh attempt: org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Unable to restore connection to its original state
--------------------------------------------------
SQL State  : 42P05
Error Code : 0
Message    : ERROR: prepared statement "S_2" already exists

2026-02-12T20:03:51.810Z  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown initiated...
2026-02-12T20:03:53.858Z  INFO 1 --- [           main] com.zaxxer.hikari.HikariDataSource       : HikariPool-1 - Shutdown completed.
2026-02-12T20:03:54.351Z  INFO 1 --- [           main] o.apache.catalina.core.StandardService   : Stopping service [Tomcat]
2026-02-12T20:03:54.835Z  INFO 1 --- [           main] .s.b.a.l.ConditionEvaluationReportLogger : 

Error starting ApplicationContext. To display the condition evaluation report re-run your application with 'debug' enabled.
2026-02-12T20:03:55.830Z ERROR 1 --- [           main] o.s.boot.SpringApplication               : Application run failed

org.springframework.beans.factory.BeanCreationException: Error creating bean with name 'flywayInitializer' defined in class path resource [org/springframework/boot/autoconfigure/flyway/FlywayAutoConfiguration$FlywayConfiguration.class]: Unable to restore connection to its original state
--------------------------------------------------
SQL State  : 42P05
Error Code : 0
Message    : ERROR: prepared statement "S_2" already exists

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
        at com.brooks.lists.ListsServiceApplication.main(ListsServiceApplication.java:9) ~[!/:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method) ~[na:na]
        at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(Unknown Source) ~[na:na]
        at java.base/java.lang.reflect.Method.invoke(Unknown Source) ~[na:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:91) ~[app.jar:na]
        at org.springframework.boot.loader.launch.Launcher.launch(Launcher.java:53) ~[app.jar:na]
        at org.springframework.boot.loader.launch.JarLauncher.main(JarLauncher.java:58) ~[app.jar:na]
Caused by: org.flywaydb.core.internal.exception.FlywaySqlException: Unable to restore connection to its original state
--------------------------------------------------
SQL State  : 42P05
Error Code : 0
Message    : ERROR: prepared statement "S_2" already exists

        at org.flywaydb.core.internal.database.base.Connection.restoreOriginalState(Connection.java:132) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.exists(JdbcTableSchemaHistory.java:97) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.allAppliedMigrations(JdbcTableSchemaHistory.java:188) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.SchemaHistory.calculateInstalledRank(SchemaHistory.java:208) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.SchemaHistory.addAppliedMigration(SchemaHistory.java:189) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.doMigrateGroup(DbMigrate.java:400) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.lambda$applyMigrations$1(DbMigrate.java:272) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:55) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.applyMigrations(DbMigrate.java:271) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateGroup(DbMigrate.java:244) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.lambda$migrateAll$0(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:73) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.lambda$execute$0(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.jdbc.TransactionalExecutionTemplate.execute(TransactionalExecutionTemplate.java:55) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLAdvisoryLockTemplate.execute(PostgreSQLAdvisoryLockTemplate.java:56) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLConnection.lock(PostgreSQLConnection.java:96) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.schemahistory.JdbcTableSchemaHistory.lock(JdbcTableSchemaHistory.java:144) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrateAll(DbMigrate.java:139) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.command.DbMigrate.migrate(DbMigrate.java:97) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.Flyway.lambda$migrate$0(Flyway.java:188) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.FlywayExecutor.execute(FlywayExecutor.java:213) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.Flyway.migrate(Flyway.java:140) ~[flyway-core-9.22.3.jar!/:na]
        at org.springframework.boot.autoconfigure.flyway.FlywayMigrationInitializer.afterPropertiesSet(FlywayMigrationInitializer.java:66) ~[spring-boot-autoconfigure-3.2.5.jar!/:3.2.5]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.invokeInitMethods(AbstractAutowireCapableBeanFactory.java:1833) ~[spring-beans-6.1.6.jar!/:6.1.6]
        at org.springframework.beans.factory.support.AbstractAutowireCapableBeanFactory.initializeBean(AbstractAutowireCapableBeanFactory.java:1782) ~[spring-beans-6.1.6.jar!/:6.1.6]
        ... 25 common frames omitted
Caused by: org.postgresql.util.PSQLException: ERROR: prepared statement "S_2" already exists
        at org.postgresql.core.v3.QueryExecutorImpl.receiveErrorResponse(QueryExecutorImpl.java:2713) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.processResults(QueryExecutorImpl.java:2401) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.core.v3.QueryExecutorImpl.execute(QueryExecutorImpl.java:368) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgStatement.executeInternal(PgStatement.java:498) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgStatement.execute(PgStatement.java:415) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgPreparedStatement.executeWithFlags(PgPreparedStatement.java:190) ~[postgresql-42.6.2.jar!/:42.6.2]
        at org.postgresql.jdbc.PgPreparedStatement.execute(PgPreparedStatement.java:177) ~[postgresql-42.6.2.jar!/:42.6.2]
        at com.zaxxer.hikari.pool.ProxyPreparedStatement.execute(ProxyPreparedStatement.java:44) ~[HikariCP-5.0.1.jar!/:na]
        at com.zaxxer.hikari.pool.HikariProxyPreparedStatement.execute(HikariProxyPreparedStatement.java) ~[HikariCP-5.0.1.jar!/:na]
        at org.flywaydb.core.internal.jdbc.JdbcTemplate.execute(JdbcTemplate.java:182) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.postgresql.PostgreSQLConnection.doRestoreOriginalState(PostgreSQLConnection.java:44) ~[flyway-core-9.22.3.jar!/:na]
        at org.flywaydb.core.internal.database.base.Connection.restoreOriginalState(Connection.java:130) ~[flyway-core-9.22.3.jar!/:na]
        ... 49 common frames omitted
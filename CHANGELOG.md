# Changelog

### [0.4.0] - 2020-11-19

* Supporting absolute urls. The configuration has `baseUrl` parameter now.

### [0.3.0] - 2020-11-16

* Markdown supports images attaching.
* The editor removes not used files from data.

### [0.2.2] - 2020-10-31

* The editor supports the two-level collection now.

### [0.2.1] - 2020-10-29

* One new strategy to generate website files. You can change this strategy in the editor. Find the new "Configuration" section in the sidebar on the left. Current T3MPL supports two strategies:
  * **Absolute Path Strategy (default)** - Anchors on the page have direct paths to files, i.e. `<a href="contact.html">`.
  * **Directory Path Strategy (new)** - Every page is generated to own directory to the index.html file. Anchors on the page have the path to the directory only (without index.html), i.e. `<a href="/contact/">`. That strategy should work on the most popular servers like Apache, Nginx and IIS.

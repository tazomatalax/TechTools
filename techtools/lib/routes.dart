import 'package:flutter/material.dart';
import 'package:techtools/pages/home_page.dart';
import 'package:techtools/pages/categories/electronic_tools_page.dart';
import 'package:techtools/pages/categories/signal_power_tools_page.dart';
import 'package:techtools/pages/categories/communication_tools_page.dart';
import 'package:techtools/pages/categories/developer_tools_page.dart';
import 'package:techtools/pages/legal/about_page.dart';
import 'package:techtools/pages/legal/privacy_page.dart';
import 'package:techtools/pages/legal/terms_page.dart';
import 'package:techtools/pages/legal/contact_page.dart';
import 'package:techtools/tools/electronic/ohms_law_calculator.dart';

// Tool imports will be added as we create them

class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    switch (settings.name) {
      case '/':
        return MaterialPageRoute(builder: (_) => const HomePage());
      case '/electronic-tools':
        return MaterialPageRoute(builder: (_) => const ElectronicToolsPage());
      case '/signal-power-tools':
        return MaterialPageRoute(builder: (_) => const SignalPowerToolsPage());
      case '/communication-tools':
        return MaterialPageRoute(builder: (_) => const CommunicationToolsPage());
      case '/developer-tools':
        return MaterialPageRoute(builder: (_) => const DeveloperToolsPage());
      
      // Electronic Tools
      case '/electronic-tools/ohms-law':
        return MaterialPageRoute(builder: (_) => const OhmsLawCalculator());
      
      // Legal pages
      case '/about':
        return MaterialPageRoute(builder: (_) => const AboutPage());
      case '/privacy':
        return MaterialPageRoute(builder: (_) => const PrivacyPage());
      case '/terms':
        return MaterialPageRoute(builder: (_) => const TermsPage());
      case '/contact':
        return MaterialPageRoute(builder: (_) => const ContactPage());
      
      // TODO: Add routes for all tools as we implement them
      
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
} 
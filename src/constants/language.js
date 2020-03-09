export default {
    appName: "TestApp",
    promotions: {
        potential_audience: (l) => {
            switch (l) {
                case "fr": return `Public potentiel (environ)`
                case "en": return `Potential Audience (approx.)`
            }
        },
        choose_audience: (l) => {
            switch (l) {
                case "fr": return `Choisissez le public`
                case "en": return `Choose Audience`
            }
        },
        add_location: (l) => {
            switch (l) {
                case "fr": return `Ajouter des emplacements`
                case "en": return `Add Location(s)`
            }
        },
        select_categories: (l) => {
            switch (l) {
                case "fr": return `Sélectionnez les catégories`
                case "en": return `Select Categories`
            }
        },
        choose_age_range: (l) => {
            switch (l) {
                case "fr": return `Choisissez la tranche d'âge`
                case "en": return `Choose Age Range`
            }
        },
        locations: (l) => {
            switch (l) {
                case "fr": return `Emplacements`
                case "en": return `Locations`
            }
        },
        categories: (l) => {
            switch (l) {
                case "fr": return `Catégories`
                case "en": return `Categories`
            }
        },
        age: (l) => {
            switch (l) {
                case "fr": return `Âge`
                case "en": return `Age`
            }
        },
        gender: (l) => {
            switch (l) {
                case "fr": return `Le genre`
                case "en": return `Gender`
            }
        },
        select_all: (l) => {
            switch (l) {
                case "fr": return `Tout sélectionner`
                case "en": return `Select all`
            }
        },
        select_all: (l) => {
            switch (l) {
                case "fr": return `Tout sélectionner`
                case "en": return `Select all`
            }
        },
        female: (l) => {
            switch (l) {
                case "fr": return `Tout sélectionner`
                case "en": return `Female`
            }
        },
        male: (l) => {
            switch (l) {
                case "fr": return `Mâle`
                case "en": return `Male`
            }
        },
        non_binary: (l) => {
            switch (l) {
                case "fr": return `Non-binaire`
                case "en": return `Non-binary`
            }
        },
        transgender: (l) => {
            switch (l) {
                case "fr": return `Transgenres`
                case "en": return `Transgender`
            }
        },
        other: (l) => {
            switch (l) {
                case "fr": return `Autre`
                case "en": return `Other`
            }
        },
        next: (l) => {
            switch (l) {
                case "fr": return `Prochain`
                case "en": return `Next`
            }
        },
        duration: (l) => {
            switch (l) {
                case "fr": return `Durée`
                case "en": return `Duration`
            }
        },
        days: (l) => {
            switch (l) {
                case "fr": return `Journées`
                case "en": return `Days`
            }
        },
        per_day: (l) => {
            switch (l) {
                case "fr": return `Par jour`
                case "en": return `Per Day`
            }
        },
        estimate_reach: (l) => {
            switch (l) {
                case "fr": return `Estimation de la portée`
                case "en": return `Estimate reach`
            }
        },
        total_spends: (l) => {
            switch (l) {
                case "fr": return `Dépenses totales`
                case "en": return `Total spends`
            }
        },
        over: (l) => {
            switch (l) {
                case "fr": return `plus de`
                case "en": return `over`
            }
        },
        ready_set_promote: (l) => {
            switch (l) {
                case "fr": return `Prêt. Ensemble. Promouvoir!`
                case "en": return `Ready. Set. Promote!`
            }
        },
        audience: (l) => {
            switch (l) {
                case "fr": return `Public`
                case "en": return `Audience`
            }
        },
        promotion_cost_title: (l) => {
            switch (l) {
                case "fr": return `Cette promotion vous coûtera un total de`
                case "en": return `This promotion will cost you a total of`
            }
        },
        wallet_balance: (l,amount) => {
            switch (l) {
                case "fr": return `Vous avez actuellement $${amount} USD en portefeuille`
                case "en": return `You currently have $${amount} USD in wallet`
            }
        },
        add_funds: (l) => {
            switch (l) {
                case "fr": return `AJOUTER DES FONDS`
                case "en": return `ADD FUNDS`
            }
        },
        promotion_guide: (l) => {
            switch (l) {
                case "fr": return `En créant cette promotion, vous avez accepté les directives de Woodlig en matière de publicité et de promotion.`
                case "en": return `By creating this promotion you have agreed to Woodlig's Advertising & Promotion Guidelines.`
            }
        },
        create_promotion: (l) => {
            switch (l) {
                case "fr": return `CRÉER UNE PROMOTION`
                case "en": return `CREATE PROMOTION`
            }
        },
        done: (l) => {
            switch (l) {
                case "fr": return `Terminé`
                case "en": return `Done`
            }
        },

        //UserPromotion start
        completed: (l) => {
            switch (l) {
                case "fr": return `Terminé`
                case "en": return `Completed`
            }
        },

        //PromotionInsights Start
        promotion_insights: (l) => {
            switch (l) {
                case "fr": return `Aperçu des promotions`
                case "en": return `Promotions Insights`
            }
        },
        view_original_post: (l) => {
            switch (l) {
                case "fr": return `Voir le message d'origine`
                case "en": return `View original post`
            }
        },
        elapsed_time: (l) => {
            switch (l) {
                case "fr": return `Temps écoulé`
                case "en": return `Elapsed time`
            }
        },
        remaining_time: (l) => {
            switch (l) {
                case "fr": return `Temps restant`
                case "en": return `Remaining time`
            }
        },
        spent: (l) => {
            switch (l) {
                case "fr": return `Dépensé`
                case "en": return `Spent`
            }
        },
        of_budget: (l,amount) => {
            switch (l) {
                case "fr": return `de votre budget de $${amount} USD`
                case "en": return `of your $${amount} USD budget`
            }
        },
        promotion_status: (l) => {
            switch (l) {
                case "fr": return `Statut de la promotion:`
                case "en": return `Promotion Status:`
            }
        },
        views: (l) => {
            switch (l) {
                case "fr": return `Des vues`
                case "en": return `Views`
            }
        },
        no_view_data: (l) => {
            switch (l) {
                case "fr": return `Aucune vue de données`
                case "en": return `No View Data`
            }
        },
        reach: (l) => {
            switch (l) {
                case "fr": return `Atteindre`
                case "en": return `Reach`
            }
        },
        no_reach_data: (l) => {
            switch (l) {
                case "fr": return `Aucune donnée de portée`
                case "en": return `No Reach Data`
            }
        },
       view_more_analytics : (l) => {
          switch (l) {
              case "fr": return `Voir plus d'analyses`
              case "en": return `View More Analytics`
          }
        },
       pause_promotion : (l) => {
          switch (l) {
              case "fr": return `Promotion Pause`
              case "en": return `Pause Promotion`
          }
        },
       resume_promotion : (l) => {
          switch (l) {
              case "fr": return `Reprendre la promotion`
              case "en": return `Resume Promotion `
          }
        },
       terminate_promotion : (l) => {
          switch (l) {
              case "fr": return `Terminer la promotion`
              case "en": return `Terminate Promotion`
          }
        },
       delete_promotion : (l) => {
          switch (l) {
              case "fr": return `Supprimer la promotion`
              case "en": return `Delete Promotion `
          }
        },
       reactive_promotion : (l) => {
          switch (l) {
              case "fr": return `Promotion réactive`
              case "en": return `Reactivete Promotion `
          }
        },

        //OnYourMind
        nothing : (l) => {
           switch (l) {
               case "fr": return `Dis quelquechose ...`
               case "en": return `Say something ...`
           }
         },

         //TabNavigator
         home : (l) => {
            switch (l) {
                case "fr": return `Accueil`
                case "en": return `Home`
            }
          },
         trending : (l) => {
            switch (l) {
                case "fr": return `Tendance`
                case "en": return `Trending`
            }
          },
         casting_calls : (l) => {
            switch (l) {
                case "fr": return `Appel de casting`
                case "en": return `Casting Call`
            }
          },
         talents : (l) => {
            switch (l) {
                case "fr": return `Talent`
                case "en": return `Talent`
            }
          },
         market_place : (l) => {
            switch (l) {
                case "fr": return `Place du marché`
                case "en": return `Market Place`
            }
          },

          //AddLocationScreen
          search_for_location : (l) => {
             switch (l) {
                 case "fr": return `Rechercher un lieu`
                 case "en": return `Search for Location`
             }
           },

         //BussinessChooseSkill
         search_skill : (l) => {
            switch (l) {
                case "fr": return `Compétence de recherche`
                case "en": return `Search Skill`
            }
          },
         //CastingCallFilter
         type_location_here : (l) => {
            switch (l) {
                case "fr": return `Saisissez un emplacement ici`
                case "en": return `Type a location here`
            }
          },

         //CastingCallsScreen
         search_casting_calls : (l) => {
            switch (l) {
                case "fr": return `Rechercher des appels de casting`
                case "en": return `Search casting calls`
            }
          },
         //CreateCircleScreen
         enter_circle_name_here : (l) => {
            switch (l) {
                case "fr": return `Entrez le nom du cercle ici`
                case "en": return `Enter circle name here`
            }
          },

         //EditCastingCall
         wrire_production_title_here : (l) => {
            switch (l) {
                case "fr": return `Écrivez le titre de la production ici`
                case "en": return `Write production title here`
            }
          },
         wrire_production_type_here : (l) => {
            switch (l) {
                case "fr": return `Entrez le type de production ici`
                case "en": return `Enter production type here`
            }
          },
         wrire_production_description_here : (l) => {
            switch (l) {
                case "fr": return `Écrivez la description de la production ici`
                case "en": return `Write the production description here`
            }
          },
         wrire_date_venue_here : (l) => {
            switch (l) {
                case "fr": return `Écrivez la date et le lieu ici`
                case "en": return `Write date and venue here`
            }
          },

          //EditExperience
         intro_spider_verse : (l) => {
            switch (l) {
                case "fr": return `Dans le vers d'araignée`
                case "en": return `Into the Spider-Verse`
            }
          },
         sony_picture_animation : (l) => {
            switch (l) {
                case "fr": return `Sony Pictures Animation`
                case "en": return `Sony Pictures Animation`
            }
          },
         wrire_here_200_characters : (l) => {
            switch (l) {
                case "fr": return `Écrivez ici (200 caractères)`
                case "en": return `Write here (200 characters)`
            }
          },

          //FeauturedTalentsScreen
         who_are_you_looking_for : (l) => {
            switch (l) {
                case "fr": return `Comment cherchez-vous?`
                case "en": return `Who are you looking for?`
            }
          },
          //LoginScreen
         email_username : (l) => {
            switch (l) {
                case "fr": return `Courriel ou inventaire`
                case "en": return `Email or Username`
            }
          },
         password : (l) => {
            switch (l) {
                case "fr": return `Mot de passe`
                case "en": return `Password`
            }
          },


          //SignUpScreen
          username: (l) => {
            switch (l) {
                case "fr": return `En fête`
                case "en": return `Username`
            }
          },
         email_or_phone : (l) => {
            switch (l) {
                case "fr": return `Courriel ou téléphone`
                case "en": return `Email or Phone`
            }
          },
         confirm_password : (l) => {
            switch (l) {
                case "fr": return `Confirmer le mot de passe`
                case "en": return `Confirm Password`
            }
          },

         signup : (l) => {
            switch (l) {
                case "fr": return `Chanter`
                case "en": return `Signup`
            }
          },
         login : (l) => {
            switch (l) {
                case "fr": return `Se connecter`
                case "en": return `Login`
            }
          },

          //PostAJob
         write_production_title : (l) => {
            switch (l) {
                case "fr": return `Production intitulée Hare`
                case "en": return `Write production title here`
            }
          },
         enter_product_type : (l) => {
            switch (l) {
                case "fr": return `Entrez les conseils de production ici`
                case "en": return `Enter production type here`
            }
          },
         enter_text_here : (l) => {
            switch (l) {
                case "fr": return `Saisissez le texte ici`
                case "en": return `Enter text here`
            }
          },

          //PostCommentsReply
         add_comment : (l) => {
            switch (l) {
                case "fr": return `Un demi-commentaire ...`
                case "en": return `Add a comment...`
            }
          },

          //RatingsScreen
         leave_your_feedback : (l) => {
            switch (l) {
                case "fr": return `Prenez votre avis`
                case "en": return `Leave your feedback`
            }
          },

          //SearchChatUser
         type_here : (l) => {
            switch (l) {
                case "fr": return `Conseils ici ...`
                case "en": return `Type Here...`
            }
          },

          //SearchChatUser
         search_people_hash : (l) => {
            switch (l) {
                case "fr": return `Cerch Pehopele, Hastings Attack`
                case "en": return `Search people, hastags etc`
            }
          },

          //TagPeopleScreen
         search_people : (l) => {
            switch (l) {
                case "fr": return `Rechercher Pehoppe`
                case "en": return `Search People`
            }
          },

      }
}
